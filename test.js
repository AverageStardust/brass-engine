const { Builder, By } = require("selenium-webdriver");
const { exec } = require("child_process");

const username = `wyatt.durbanogmail`; // it is a free trial account, don't get cheeky
const accessKey = `uVU0Y7oD1BaKYPiNFGcPAihjabehgWcznOXtGIBxoljlemEKJE`;

const GRID_HOST = `hub.lambdatest.com/wd/hub`;

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
	return;
	console.log("Opening examples ...");
	childProcess = exec("npm run examples", (error, _, stderr) => {
		if (error) throw error;
		if (stderr) throw Error(`stderr: ${stderr}`);
	});

	let stdoutStr = "", waitingOnStdout = true;
	childProcess.stdout.on("data", async (data) => {
		if (!waitingOnStdout) return;
		stdoutStr += data.toString();
		if (stdoutStr.endsWith("Serving files from: ./\n")) {
			waitingOnStdout = false;

			const urlMatch = stdoutStr.match(RegExp("Tunnel:.+"));
			if (!urlMatch) throw Error("Browersync did not log a Tunnel URL");
			const url = urlMatch[0].substring(8);

			await runAllTests(url);
		}
	});
}

async function runAllTests(baseURL) {
	console.log(`Testing examples at ${baseURL}/examples ...`);

	const promises = [];
	["particleWarp", "rainbowShooter", "shaderTest"].forEach(example => {
		const exampleURL = `${baseURL}/examples/${example}/index.html`;
		promises.push(runTest(`${example} on Chrome`, exampleURL, chromeCapabilities));
		promises.push(runTest(`${example} on Firefox`, exampleURL, firefoxCapabilities));
		promises.push(runTest(`${example} on Safari`, exampleURL, safariCapabilities));
	});

	Promise.allSettled(promises)
		.then(() => {
			childProcess.kill();
			process.exit(0);
		}, () => {
			childProcess.kill();
			process.exit(1);
		});
}

function runTest(name, ...args) {
	return new Promise(async (resolve, reject) => {
		try {
			await runTestUnprotected(name, ...args);
			console.log(`Finished test: ${name}`);
			resolve();
		} catch (err) {
			console.log(`Failed test: ${name}`);
			console.error(err)
			reject();
		}
	});
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
		if (error.name !== "TimeoutError") {
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