/* TODO : 
		- selecting commonly occuring letters//kk
		- most problematic words
		- periodic rerenders of canvas chart
		- selecting different files
*/
var VocabularyTrainer = function (options, vocabularyData) {
    this.options = options;
    this.vocabularyData = vocabularyData;
    this.currentShuffled = [];
    this.stats = [];

    for (var i = 0; i < options.trainingCycles; i++) {
        this.stats.push(new Array());
    }

    var i = 0;

    for (var i = 0; i < this.vocabularyData.words.length; i++) {
        var word = this.vocabularyData.words[i];
        word.id = i;
        this.currentShuffled.push(word);
    }

    this.shuffleNewBatch();
    this.trainingCycles = options.trainingCycles || 5;
    this.context = {
        currentWordIndex: 0,
        currentWordCount: 0,
        currentCycle: 0
    };
}

VocabularyTrainer.prototype = {
    loadJSON: function (fileName) {
        /*load up from file*/
    },

    intialize: function (context) {
        this.context.currentCycle = context.currentCycle || 0;
        this.context.currentWordIndex = context.currentWordIndex || 0;

    },

    generatePossibleLetters: function () {
        var letterFreq = {};

        for (var j = 0; j < this.vocabularyData.words.length; j++) {
            var w = this.vocabularyData.words[j].translation;
            for (var i = 0; i < w.length; i++)
                if (_.isUndefined(letterFreq[w[i]]))
                    letterFreq[w[i]] = 0;
                else
                    letterFreq[w[i]]++;
        }
        return letterFreq;
    },

    shuffleNewBatch: function () {
        this.currentShuffled = shuffle(this.currentShuffled);
        console.log('Shuffled batch : ');
        console.log(this.currentShuffled);
    },

    submitAnswer: function (user_translation, word_id) {
        var t_translation = this.vocabularyData.words[this.context.currentWordIndex].translation;
        var newCycle = false;
        if (this.context.currentWordCount == this.vocabularyData.words.length - 1)
            newCycle = true;

        if (t_translation == user_translation) {
            console.log("true");
            this.addRecord(this.context.currentWordIndex, true);
            return {
                status: true,
                newCycle: newCycle
            }
        } else {
            console.log("false");
            this.addRecord(this.context.currentWordIndex, false);
            console.log("WRONG");
            console.log('currentWordIndex : ', this.context.currentWordIndex);
            console.log(this.vocabularyData.words[this.context.currentWordIndex]);
            return {
                status: false,
                translation: t_translation,
                newCycle: newCycle
            };
        }
    },

    nextWord: function () {
    	console.log('CURRENT WORD COUNT ', this.context.currentWordCount);
        if (this.context.currentWordCount < this.vocabularyData.words.length-1) {
        	this.context.currentWordCount++;
            console.log("Loading next word.");
            this.context.currentWordIndex = this.currentShuffled[this.context.currentWordCount].id;
            
            return {
                status: true,
                data: this.currentShuffled[this.context.currentWordCount]
            };
        } else {
            if (this.context.currentCycle < this.options.trainingCycles) {
                console.log("Starting next cycle");
                this.context.currentCycle++;
                this.context.currentWordCount = 0;
                this.shuffleNewBatch();
                this.context.currentWordIndex = this.currentShuffled[0].id;
       
                return {
                    status: true,
                    data: this.currentShuffled[0]
                };
            } else {
                console.log("Finished!");
                return {
                    status: false
                };
            }
        }
    },

    addRecord: function (word_id, status) {
        this.stats[this.context.currentCycle].push({
            word_id: word_id,
            status: status
        });
    },

    generateStatistics: function () {
        var statistics = false;
     

        /* 1. generate current cycle progress */
        var cyclesProgress = [];
        for (var i = 0; i < this.context.currentCycle+1; i++) {
            var cycle = this.stats[i];
            var cycleSum = 0;
            var cycleTotal = this.stats[i].length;

            for (var j = 0; j < cycleTotal; j++) { // those funny  ? : ? :
                if (this.stats[i][j].status)
                    cycleSum++;
            }

            cyclesProgress.push(cycleSum / cycleTotal);
        }

        statistics = {'cyclesProgress' : cyclesProgress};

        return statistics;
    }

}
shuffle = function (o) {
    for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};