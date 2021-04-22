const express = require('express');
const app = new express();
const dotenv = require('dotenv');
dotenv.config();


function getNLUInstance() {
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-04-22',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
 const sentiment = {
        'url': req.query.url,
        'features': {
            'emotion': {}
        }
    }
    
    getNLUInstance().analyze(sentiment)
    .then(analysisResults => {
    return res.send(analysisResults.result.emotion.document.emotion);
    })
});

app.get("/url/sentiment", (req,res) => {
    const analyze = {
        'url': req.query.url,
        'features': {
            'sentiment': {}
        }
    }
    
    getNLUInstance().analyze(analyze)
    .then(analysisResults => {
    return res.send(analysisResults.result.sentiment.document.label);
    })
});

app.get("/text/emotion", (req,res) => {
    const sentiment = {
        'url': req.query.text,
        'features': {
            'emotion': {}
        }
    }
    
    getNLUInstance().analyze(sentiment)
    .then(analysisResults => {
    return res.send(analysisResults.result.emotion.document.emotion);
    })
});

app.get("/text/sentiment", (req,res) => {
     const analyze = {
        'url': req.query.text,
        'features': {
            'sentiment': {}
        }
    }
    
    getNLUInstance().analyze(analyze)
    .then(analysisResults => {
    return res.send(analysisResults.result.sentiment.document.label);
    })
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

