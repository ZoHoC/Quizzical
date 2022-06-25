import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
//images
import smallBlobLemon from "./images/smallBlobLemon.png";
import smallBlobBlue from "./images/smallBlobBlue.png";
//files
import Question from "./components/Question";
import randomizeAnswers from "./utils";
import Menu from "./components/Menu";

function App() {
  const [quizData, setQuizData] = useState([]);
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startFetch, setStartFetch] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    difficulty: "Any difficulty",
    categoryId: "0",
    number: 5,
  });

  // isStarted state is used to change between Menu and quiz. If user finishes quiz and checks for anwsers he can still go back to Menu and thus we need to change isChecked state to false
  function startQuiz() {
    setIsStarted(prevIsStarted => !prevIsStarted);
    setIsChecked(false);
  }

  // When Start button is pressed we want to initialize useEffect.
  function initiateFetch() {
    setStartFetch(prevStartFetch => !prevStartFetch);
  }

  // Since Menu button is using isStarted state to change between Menu and didnt want it to trigger useEffect each time I created additional function for start button which gives triggers useEffect
  function wrapperFucntion() {
    startQuiz();
    initiateFetch();
  }

  // Sets loading screen until fetch is completed. Refactoring incoming data.
  useEffect(() => {
    setIsLoading(prevIsLoading => !prevIsLoading);
    const difficulty = formData.difficulty === "Any difficulty" ? "" : `&difficulty=${formData.difficulty.toLowerCase()}`;
    const category = formData.categoryId === "0" ? "" : `&category=${formData.categoryId}`;
    const num = formData.number;
    fetch(`https://opentdb.com/api.php?amount=${num}${category}${difficulty}&encode=url3986`)
      .then(res => res.json())
      .then(data => {
        setQuizData(
          data.results.map(item => {
            const { category, type, difficulty, question, correct_answer, incorrect_answers } = item;
            return {
              id: nanoid(),
              category: category,
              type: type,
              difficulty: difficulty,
              question: question,
              answers: checkType(type, correct_answer, incorrect_answers),
              correct_answer: correct_answer,
            };
          })
        );
        setIsLoading(prevIsLoading => !prevIsLoading);
      });
  }, [startFetch]);

  // Checks type of question (multiple or true/false)
  function checkType(type, correct, incorrect) {
    // if the type is Multiple it creates an array with shuffles anwsers. Then we map over to create an array of objects where we give each anwser 3 states and Id
    if (type === "multiple") {
      const randomArray = randomizeAnswers([correct, ...incorrect]);
      const answerObject = randomArray.map(answer => ({
        text: answer,
        isPressed: false,
        isCorrect: answer === correct,
        isWrong: answer !== correct,
        id: nanoid(),
      }));
      return answerObject;
    } else {
      // if the type is True/false we want to return first True then False so when we render anwsers it is always True first and False second
      return [
        {
          text: "True",
          isPressed: false,
          isCorrect: "True" === correct,
          isWrong: "True" !== correct,
          id: nanoid(),
        },
        {
          text: "False",
          isPressed: false,
          isCorrect: "False" === correct,
          isWrong: "False" !== correct,
          id: nanoid(),
        },
      ];
    }
  }

  // Changes state of isPressed of anwser
  function toggleChoice(questionId, answerId) {
    setQuizData(prevQuizData =>
      prevQuizData.map(question => {
        // if pressed question (questionId) is not equal to question.id it returns it
        if (questionId != question.id) {
          return question;
        } else {
          // if pressed question is equal then it spreads that question and looks at anwser array
          return {
            ...question,
            answers: question.answers.map(answer => ({
              // checks each anwser id to see if it is equal to pressed id (anwserId). Changes isPressed on pressed anwser and gives false on all other anwsers
              ...answer,
              isPressed: answerId === answer.id ? !answer.isPressed : false,
            })),
          };
        }
      })
    );
  }

  // Changes isChecked state which triggers conditionals in Question component. Running check function again starts a new game.
  function check() {
    if (!isChecked) {
      setIsChecked(true);
    } else {
      setStartFetch(prevStartFetch => !prevStartFetch);
      setIsChecked(false);
    }
  }

  // Filters thru quitData questions and searches for anwsers who has isPressed = true and isCorrect = true. Creates a new array with those questions.
  function correctNum() {
    const correctQuestion = quizData.filter(question => {
      return question.answers.some(answer => answer.isPressed && answer.isCorrect);
    });
    return correctQuestion.length;
  }

  const questionHtml = quizData.map((data, i) => {
    return <Question key={data.id} {...data} isChecked={isChecked} toggleChoice={toggleChoice} />;
  });

  // If the game hasnt started it shows Menu
  // If it started but data hasnt been fetched it shows loading screen
  // if it started and loading is complete it shows The Quiz
  return (
    <main>
      {!isStarted && <Menu handleClick={wrapperFucntion} formData={formData} setFormData={setFormData} />}
      {isStarted && isLoading && <div className="quiz--loading">Loading...</div>}
      {isStarted && !isLoading && (
        <div className="app">
          {questionHtml}
          <div className="quiz--buttons">
            <button className="quiz--btn quiz--btn__check" onClick={check}>
              {isChecked ? "Play again" : "Check anwsers"}
            </button>
            <button
              className="quiz--btn quiz--btn__stop"
              onClick={() => {
                startQuiz();
              }}
            >
              Menu
            </button>
          </div>
          {isChecked && (
            <p className="quiz--correct">
              You scored {correctNum()}/{formData.number} correct anwsers
            </p>
          )}
          <img src={smallBlobBlue} className="img--Blue" alt="blueBlob" />
          <img src={smallBlobLemon} className="img--Lemon" alt="yellowBlob" />
        </div>
      )}
    </main>
  );
}

export default App;
