import React, { createContext, useState } from 'react'
import './main.css';
import axios from 'axios';

function Main() {
    const DataContext = createContext();
    const [questions, setQuestions] = useState([]);
    const [questionNum, setQuestionNum] = useState(0);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const get_data = (url) => {
        axios
        .get(url)
        .then ((result) => {
            let data = result.data.results

            data.map (question => {
                question.incorrect_answers.push(question.correct_answer)
                question.incorrect_answers.sort(() => 0.5 - Math.random())
            })

            setQuestions(data);
            console.log(data)
        })
    }

    const checkAnswer = (e) => {
        e.preventDefault()
        if (questions[questionNum].correct_answer === e.target.value){
            setCorrectAnswersCount(correctAnswersCount + 1)
        }
        setQuestionNum(questionNum + 1)
    }

    const startAgain = () => {
        setQuestionNum(0)
        setCorrectAnswersCount(0)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        let value = event.target.elements.questions_num.value
        let cat_value = event.target.elements.category.value
        let categories = [9, 10, 11]
        let url = `https://opentdb.com/api.php?amount=${value}&category=${categories[cat_value]}`
        get_data(url)
        setQuestionNum(0)
    }

  return (
      <DataContext.Provider value={questions}>
        <form onSubmit={handleSubmit}>
                <input type={"number"} name={"questions_num"} placeholder={"number questions"}/>
                <select name={"category"}>
                    <option value={0}>Cat 1</option>
                    <option value={1}>Cat 2</option>
                    <option value={2}>Cat 3</option>
                </select>
                <button> Ok </button>
        </form>

        { questions && questions.length && questions.length !== questionNum?
         (<div>
            <p>{questionNum+1}: { questions[questionNum].question } </p>
            { questions[questionNum].incorrect_answers.map((answer, index) =>
                <button  key={index} onClick={ checkAnswer } value={answer}>{ answer }</button>
            )}
         </div>)
         : null }
          { questions && questions.length && questions.length === questionNum ?
              <div>
                  <p> you had { correctAnswersCount } correct answers </p>
                  <button onClick={ startAgain }> Try again </button>
              </div>
          : null
          }
      </DataContext.Provider>
  );
}

export default Main;
