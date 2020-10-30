let sentences = [
    {
        _id: 123456,
        text: "Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight",
        spans: null
    },
    {
        _id: 454675,
        text: "And maybe that's the price you pay for the money and fame at an early age",
        spans: null
    },
    {
        _id: 012457,
        text: "But the way that we love in the night gave me life baby, I can't explain",
        spans: null
    },
    {
        _id: 985487,
        text: "And now it's clear as this promise that we're making two reflections into one 'cause it's like you're my mirror",
        spans: null
    }
];

exports.getAll = (req, res) => {
    res.send(sentences);
}

exports.update = (req, res) => {
    const index = sentences.findIndex(item => { return item._id === req.body._id});
    if(index === -1){
        res.status(404).send();
    }
    sentences[index] = req.body;
    res.status(200).send();
}