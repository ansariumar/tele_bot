



const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const paragraph = `I have a morning ritual that I need to share. I call it "the terminator". First I crouch down in the shower in the classic "naked terminator traveling through time" pose. With my eyes closed I crouch there for a minute, visualizing either Arnold or the guy from the second movie (not the chick in the third one because that one sucked) and I start to hum the terminator theme. Then I slowly rise to a standing position and open my eyes. It helps me to proceed through my day as an emotionless, cyborg badass. The only problem is if the shower curtain sticks to my terminator leg. It ruins the fantasy. \n\nTl;dr`

async function summary(paragraph) {

	const response = await openai.createCompletion({
  	model: "text-davinci-003",
  	prompt: paragraph,
  	temperature: 0.7,
  	max_tokens: 60,
  	top_p: 1.0,
  	frequency_penalty: 0.0,
  	presence_penalty: 1,
	});

	console.log(response.data.choices[0].text)
	// return response;
}

summary(paragraph)

// module.exports = { summary }