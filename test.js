const { Builder, By, TimeoutError } = require("selenium-webdriver");
const { exec } = require("child_process");
const fs = require("fs");

const username = "wyatt.durbano";
const accessKey = "05FPUpMcvqVLw55SlEKtmeqt8pG42OTe0qCUuMePYosZC24k8B";

const GRID_HOST = "hub.lambdatest.com/wd/hub";

const chromeCapabilities = {
	"browserName": "Chrome",
	"version": "92.0",
	"platform": "Windows 10",
	"resolution": "1024x768",
    "unexpectedAlertBehaviour": "accept",
	"build": "Brass"
}
const firefoxCapabilities = {
	"browserName": "Firefox",
	"version": "101.0",
	"platform": "Windows 10",
	"resolution": "1024x768",
    "unexpectedAlertBehaviour": "accept",
	"build": "Brass"
}
const safariCapabilities = {
	"browserName": "Safari",
	"version": "15.0",
	"platform": "MacOS Monterey",
	"resolution": "1024x768",
    "unexpectedAlertBehaviour": "accept",
	"build": "Brass"
}

let childProcess;

function init() {
	process.on("exit", exitHandler);
	process.on("SIGINT", exitHandler);
	process.on("SIGUSR1", exitHandler);
	process.on("SIGUSR2", exitHandler);
	process.on("uncaughtException", exitHandler);

	console.log("Opening examples ...");
	childProcess = exec("npm run examples", (error, _, stderr) => {
		if (error) throw error;
		if (stderr) throw Error(`stderr: ${stderr}`);
	});

	let stdoutStr = "", waitingOnStdout = true;
	childProcess.stdout.on("data", async (data) => {
		if (!waitingOnStdout) return;
		stdoutStr += data.toString();
		if (stdoutStr.endsWith("Serving files from: ./examples\n")) {
			waitingOnStdout = false;

			const urlMatch = stdoutStr.match(RegExp("Tunnel:.+"));
			if (!urlMatch) throw Error("Browersync did not log a Tunnel URL");
			const url = urlMatch[0].substring(8);

			await runAllTests(url);
		}
	});
}

function exitHandler(error) {
	if (!childProcess) return;
	if (error) console.error(error);
	console.log("Closing examples ...");
	childProcess.kill();
	childProcess = undefined;
}

async function runAllTests(baseURL) {
	console.log(`Testing examples at ${baseURL} ...`);

	const promises = []
	fs.readdirSync("./examples").forEach(example => {
		if (example.endsWith(".html")) return;
		const exampleURL = `${baseURL}/${example}/index.html`;
		promises.push(runTest(`${example} on Chrome`, exampleURL, chromeCapabilities));
		promises.push(runTest(`${example} on Firefox`, exampleURL, firefoxCapabilities));
		promises.push(runTest(`${example} on Safari`, exampleURL, safariCapabilities));
	});

	Promise.allSettled(promises.map(promise => promise.catch(console.error))).then(() => process.exit(0), () => process.exit(1));
}

async function runTest(name, ...args) {
	try {
		await runTestUnprotected(name, ...args);
		console.log(`Passed test: ${name}`);
	} catch (err) {
		console.log(`Failed test: ${name}`);
		throw err;
	}
}

async function runTestUnprotected(name, url, capabilities) {
	capabilities.name = name;

	let driver = new Builder()
		.usingServer("http://" + username + ":" + accessKey + "@" + GRID_HOST)
		.withCapabilities({
			...capabilities,
			...capabilities["browser"] && { browserName: capabilities["browser"] }  // Because NodeJS language binding requires browserName to be defined
		})
		.build();

	await driver.get(url);

	try {
		const continueButton = await driver.findElement(By.xpath("/html/body/div/div[4]/button"));
		continueButton.click();
	} catch (err) { }

	const documentInitialised = () =>
		driver.executeScript("return window.Brass && Brass.getTestStatus() !== null");
	
	try {
		await driver.wait(documentInitialised, 30000);
	} catch (error) {
		if (!(error instanceof TimeoutError)) {
			throw error;
		}
	}

	const errorStatus = await driver.executeScript("return Brass.getTestStatus()");

	if (errorStatus === null) {
		throw Error("Example did not set test status");
	} else if (errorStatus !== true) {
		throw Error(errorStatus);
	}

	await driver.quit();
}

init();