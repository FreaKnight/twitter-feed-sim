const fs = require('fs');
const path = require('path');

function start() {
	try {
		const [userFileName, tweetFileName] = process.argv.slice(2);
		// Would have a utils function to do null checks, but time constraints... ¯\_(ツ)_/¯
		if (!userFileName && userFileName !== null) {
			throw new Error('User data file name not supplied');
		}
		if (!tweetFileName && tweetFileName !== null) {
			throw new Error('Tweet file name not supplied');
		}
		const rawUserData = getFileData(userFileName);
		const userData = getUsers(rawUserData);
		const rawTweetData = getFileData(tweetFileName);
		const tweetData = getTweetData(rawTweetData);

		logTweets(userData, tweetData);
	} catch(err) {
		console.error(err);
	}
}

function logTweets(usersData, tweetsData) {
	// Weak object check, can be more robust with by checking the props with `hasOwnProperty` or with use of a library, ie, lodash or underscore
	if (!typeof usersData === 'object' && !Array.isArray(tweetsData) && tweetsData.length <= 0) {
		throw new Error('Could not process data');
	}
	const users = Object.keys(usersData).sort();
	for (const user of users) {
		console.log(user);
		for (const tweetData of tweetsData) {
			const [ tweetingUser, tweet ] = tweetData;
			if (tweetingUser === user || usersData[user].includes(tweetingUser)) {
				console.log(`\t@${tweetingUser}: ${tweet}`);
			}
		}
	}
}

function getTweetData(rawTweetData) {
	// Tweet data is just going to split the user and tweet and trim the whitespace
	const tweetData = [];
	for (const rawTweet of rawTweetData) {
		let [user, tweet] = rawTweet.split('>');
		// Assuming the userName and `>` will not have a space between and that there is a tweet even if it is just whitespace.
		tweetData.push([user, `${tweet.trim()}`]);
	}
	return tweetData;
}

function getUsers(rawUserData) {
	// Return an object where the unique user names is the key and their followers in an array
	// Example:
	// {
	//     "Alan": ["Martin"],
	//     "Martin": [],
	//     "Ward": ["Alan", "Martin"]
	// }
	const userData = {};
	for (const dataLine of rawUserData) {
		// Assuming that follows is always present if there is no followers
		// Example: `Martin follows `
		const users = dataLine.split('follows');
		// Could be another util
		if (!Array.isArray(users) || users.length <= 0) {
			throw new Error('Could not process user data');
		}

		const mainUser = users[0].trim();
		const rawFollowers = users.length > 1 && users[1].trim();
		if (!userData[mainUser]) {
			userData[mainUser] = [];
		}

		// Make followers an array if only one follower, better handling
		const followers = getFollowers(rawFollowers);
		for (let follower of followers) {
			follower = follower.trim();
			if (!userData[mainUser].includes(follower)) {
				userData[mainUser].push(follower);
			}
			// See if follower is not a user then add
			if (!userData[follower]) {
				userData[follower] = [];
			}
		}
	}
	return userData;
}

function getFollowers(rawFollowers) {
	let followers;
	if (rawFollowers.includes(',')) {
		followers = rawFollowers.split(',');
	} else {
		followers = [rawFollowers];
	}
	return followers;
}

function readFile(filePath) {
	return fs.readFileSync(filePath, { encoding: 'utf8' });
}

function orchestrateFileContent(fileContent) {
	if (!fileContent) {
		throw new Error('No file content to orchestrate');
	}
	return fileContent.trim().split('\r\n');
}

function getFileData(filename) {
	if (!filename.includes('.txt')) {
		throw new Error('Expecting text files');
	}
	const cwd = process.cwd();
	const filePath = path.join(cwd, 'data', filename);
	const fileContent = readFile(filePath);
	const orchestratedContent = orchestrateFileContent(fileContent);
	// Could be another util
	if (!Array.isArray(orchestratedContent) || orchestratedContent.length <= 0) {
		throw new Error('Could not process file data');
	}
	return orchestratedContent;
}

export default start;
