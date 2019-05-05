let questions = {
    extraEasy: [
        {
            "question": "In what children's game are participants chased by someone designated \"It\"?",
            "content": [
                "Tag",
                "Simon Says",
                "Charades",
                "Hopscotch"
            ],
            "correct": 0
        },
        {
            "question": "On a radio, stations are changed by using what control?",
            "content": [
                "Tuning",
                "Volume",
                "Bass",
                "Treble"
            ],
            "correct": 0
        },
        {
            "question": "Which material is most dense?",
            "content": [
                "Silver",
                "Styrofoam",
                "Butter",
                "Gold"
            ],
            "correct": 3
        }
    ],
    easy: [
        {
            "question": "Which state in the United States is largest by area?",
            "content": [
                "Alaska",
                "California",
                "Texas",
                "Hawaii"
            ],
            "correct": 0
        },
        {
            "question": "What is Aurora Borealis commonly known as?",
            "content": [
                "Fairy Dust",
                "Northern Lights",
                "Book of ages",
                "a Game of Thrones main character"
            ],
            "correct": 1
        },
        {
            "correct": 3,
            "content": [
                "developed the telescope",
                "discovered four satellites of Jupiter",
                "discovered that the movement of pendulum produces a regular time measurement",
                "All of the above"
            ],
            "question": "Galileo was an Italian astronomer who"
        },
    ],
    medium: [
        {
            "correct": 3,
            "content": [
                "the infrared light kills bacteria in the body",
                "resistance power increases",
                "the pigment cells in the skin get stimulated and produce a healthy tan",
                "the ultraviolet rays convert skin oil into Vitamin D"
            ],
            "question": "Exposure to sunlight helps a person improve his health because"
        },
        {
            "correct": 0,
            "content": [
                "a club or a local sport association for remarkable achievements",
                "amateur athlete, not necessarily an Olympian",
                "National Olympic Committee for outstanding work",
                "None of the above"
            ],
            "question": "Sir Thomas Fearnley Cup is awarded to"
        },
        {
            "correct": 1,
            "content": [
                "1968",
                "1929",
                "1901",
                "1965"
            ],
            "question": "Oscar Awards were instituted in"
        },
    ],
    hard: [
        {
            "correct": 2,
            "content": [
                "1998",
                "1989",
                "1979",
                "1800"
            ],
            "question": "When did Margaret Thatcher became the first female Prime Minister of Britain?"
        },
        {
            "correct": 2,
            "content": [
                "15th April",
                "12th December",
                "1st May",
                "1st August"
            ],
            "question": "When is the International Workers' Day?"
        },
        {
            "correct": 2,
            "content": [
                "1962",
                "1963",
                "1964",
                "1965"
            ],
            "question": "When did China test their first atomic device?"
        },
    ],
    extraHard: [
        {
            "correct": 3,
            "content": [
                "1904",
                "1905",
                "1908",
                "1909"
            ],
            "question": "When did Commander Robert Peary discover the North Pole?"
        },
        {
            "correct": 0,
            "content": [
                "819/sq. km",
                "602/sq. km",
                "415/sq. km",
                "500/sq. km"
            ],
            "question": "What is the population density of Kerala?"
        },
        {
            "correct": 1,
            "content": [
                "4 km",
                "25 km",
                "500 m to 9 km",
                "150 km"
            ],
            "question": "What is the range of missile 'Akash'?"
        }
    ]
};

/**
 * Plays a sound via HTML5 through Audio tags on the page
 *
 * @require the id must be the id of an <audio> tag.
 * @param id the id of the element to play
 * @param loop the boolean flag to loop or not loop this sound
 */
startSound = function (id, loop) {
    soundHandle = document.getElementById(id);
    if (loop)
        soundHandle.setAttribute('loop', loop);
    soundHandle.play();
}

/**
 * The View Model that represents one game of
 * Who Wants to Be a Millionaire.
 *
 * @param data the question bank to use
 */
var MillionaireModel = function (data) {
    var self = this;

    // The 15 questions of this game
    this.questions = data;

    // A flag to keep multiple selections
    // out while transitioning levels
    this.transitioning = false;

    // The current money obtained
    this.money = new ko.observable(0);

    // The current level(starting at 1)
    this.level = new ko.observable(1);

    // The three options the user can use to
    // attempt to answer a question (1 use each)
    this.usedFifty = new ko.observable(false);
    this.usedPhone = new ko.observable(false);
    this.usedAudience = new ko.observable(false);

    // Grabs the question text of the current question
    self.getQuestionText = function () {
        let level = self.level();
        let keys = {
          1: 'extraEasy',
          2: 'extraEasy',
          3: 'extraEasy',
          4: 'easy',
          5: 'easy',
          6: 'easy',
          7: 'medium',
          8: 'medium',
          9: 'medium',
          10: 'hard',
          11: 'hard',
          12: 'hard'
        };

        let key = keys[level] || 'extraHard';
        let questions = self.questions[key];
        let pick = data => data[Math.floor(Math.random() * data.length)];
        let q = self.currentQuestion = pick(questions);

        if (q.selected) {
            while (q.selected) {
                q = self.currentQuestion = pick(questions);
            }
        }

        q.selected = true;
        // console.log('updating self.currentQuestion', self.currentQuestion);

        return self.currentQuestion.question;
    };

    // Gets the answer text of a specified question index (0-3)
    // from the current question
    self.getAnswerText = function (index) {
        // console.log('self.currentQuestion', self.currentQuestion);
        return self.currentQuestion.content[index];
    };

    // Uses the fifty-fifty option of the user
    self.fifty = function (item, event) {
        if (self.transitioning)
            return;
        $(event.target).fadeOut('slow');
        var correct = this.currentQuestion.correct;
        var first = (correct + 1) % 4;
        var second = (first + 1) % 4;
        if (first == 0 || second == 0) {
            $("#answer-one").fadeOut('slow');
        }
        if (first == 1 || second == 1) {
            $("#answer-two").fadeOut('slow');
        }
        if (first == 2 || second == 2) {
            $("#answer-three").fadeOut('slow');
        }
        if (first == 3 || second == 3) {
            $("#answer-four").fadeOut('slow');
        }
    }

    // Fades out an option used if possible
    self.fadeOutOption = function (item, event) {
        if (self.transitioning)
            return;
        $(event.target).fadeOut('slow');
    }

    // Attempts to answer the question with the specified
    // answer index (0-3) from a click event of elm
    self.answerQuestion = function (index, elm) {
        if (self.transitioning)
            return;
        self.transitioning = true;
        if (self.currentQuestion.correct === index) {
            self.rightAnswer(elm);
        } else {
            self.wrongAnswer(elm);
        }
    };

    // Executes the proceedure of a correct answer guess, moving
    // the player to the next level (or winning the game if all
    // levels have been completed)
    self.rightAnswer = function (elm) {
        $("#" + elm).slideUp('slow', function () {
            startSound('rightsound', false);
            $("#" + elm).css('background', 'green').slideDown('slow', function () {
                self.money($(".active").data('amt'));
                if (self.level() + 1 > 15) {
                    $("#game").fadeOut('slow', function () {
                        $("#game-over").html('You Win!');
                        $("#game-over").fadeIn('slow');
                    });
                } else {
                    self.level(self.level() + 1);
                    $("#" + elm).css('background', 'none');
                    // console.log(self.currentQuestion);

                    $("#answer-one").show();
                    $("#option-a").text(self.getAnswerText(0));

                    $("#answer-two").show();
                    $("#option-b").text(self.getAnswerText(1));

                    $("#answer-three").show();
                    $("#option-c").text(self.getAnswerText(2));

                    $("#answer-four").show();
                    $("#option-d").text(self.getAnswerText(3));

                    self.transitioning = false;
                }
            });
        });
    }

    // Executes the proceedure of guessing incorrectly, losing the game.
    self.wrongAnswer = function (elm) {
        $("#" + elm).slideUp('slow', function () {
            startSound('wrongsound', false);
            $("#" + elm).css('background', 'red').slideDown('slow', function () {
                $("#game").fadeOut('slow', function () {
                    $("#game-over").html('Game Over!');
                    $("#game-over").fadeIn('slow');
                    self.transitioning = false;
                });
            });
        });
    }

};

// Executes on page load, bootstrapping
// the start game functionality to trigger a game model
// being created
$(document).ready(function () {
    $("#start").click(function () {
        ko.applyBindings(new MillionaireModel(questions));
        $("#pre-start").fadeOut('slow', function () {
            startSound('background', true);
            $("#game").fadeIn('slow');
        });
    });

});