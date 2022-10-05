import React from 'react'

const InterviewCard = ({props}) => {

    const {title,startTime,endTime,participants} = props
    var options1 = { year: 'numeric', month: 'long', day: 'numeric' };
    var options2 = { minute: '2-digit', hour: '2-digit' };
    const date = new Date(startTime)
    const st = new Date(startTime)
    const et = new Date(endTime)
    // console.log(participants)
  return (
    <div className='card'>
        <h2 className='card-title'>{title}</h2>
        <div className="card-time">
            <div className="card-date">{date.toLocaleDateString("en-US", options1)}</div>
            <div className="card-time">
                <p>{st.toLocaleTimeString(undefined, options2)} - {et.toLocaleTimeString(undefined, options2)}</p>
            </div>
        </div>
        <ul>
        <h4>Particpants</h4>
            {participants && participants.map((participant)=> <li>{participant}</li>)}
        </ul>
        
    </div>
  )
}

export default InterviewCard