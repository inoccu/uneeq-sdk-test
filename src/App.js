import './App.css';
import { Uneeq } from 'uneeq-js';
import axios from 'axios';

function App() {
  let fmMessageHandler = (msg) => {
    console.log('Uneeq Message: ', msg);
    if (msg.uneeqMessageType === 'Ready') {
      //The Digital Human is setup and streaming to the end user
    } else if (msg.uneeqMessageType === 'AvatarQuestionText') {
      //Question asked of the Digital Human
    } else if (msg.uneeqMessageType === 'AvatarAnswer') {
      //Response to the question, including meta data.
    }
  }

  var currentUneeq = null

  /*
   Sending audio
   The Javascript SDK allows customers to speak to a digital human using a ‘push to talk’ interaction mode. 
   This means that a user holds a keyboard key for the period of time they wish to talk to the digital human.
   To enable this you need to call the startRecording() and stopRecording() methods at the beginning 
   and end of the period of time you want to capture. The example below enables the user to use the spacebar to talk:
  */
  window.onkeydown = (e) => {
    if (e.code === 'Space' && !e.repeat) {
      console.log('start recording')
      currentUneeq.startRecording()
    }
  }

  window.onkeyup = (e) => {
    if (e.code === 'Space' && !e.repeat) {
      console.log('end recording')
      currentUneeq.stopRecording()
    }
  }

  axios.request({
    method: 'GET',
    url: process.env.REACT_APP_UNEEQ_TOKEN_URL,
    headers: {
      'content-type': 'application/json',
    }
  }).then((response) => {
    console.log(response.data)
    currentUneeq = new Uneeq({
      // The ID which identifies the Persona that you wish to start a conversation with.
      // You can find your personaId within the Personas area of the UneeQ Creator.Otherwise, 
      // our Customer Success team can provide you with this ID.
      'conversationId': process.env.REACT_APP_UNEEQ_PERSONA_ID,
      // The URL to the region of the UneeQ platform where your Persona is provisioned.
      'url': process.env.REACT_APP_UNEEQ_URL,
      // The HTML Div element that the digital human video will be presented in.
      'avatarVideoContainerElement': document.getElementById('remoteVideo'),
      // The HTML Div element that the user's local camera will be presented in.
      // If you don't wish to display the user's camera, you can use the value document.createElement('div')
      'localVideoContainerElement': document.createElement('div'),
      // Your method which handles real-time message objects from the UneeQ platform
      'messageHandler': (msg) => fmMessageHandler(msg),
      // Play welcome message. Optional boolean. Default is false.
      'playWelcome': true,
      // Defines whether the users local video stream (camera) should be sent on session start. Boolean. 
      // If true, the user will need to allow permission to use their device.Default value is true.
      'sendLocalVideo': false,
      // Defines whether the users local audio stream (microphone) should be sent on session start. 
      // If true, the user will need to allow permission to use their device.Boolean.Default value is true.
      'sendLocalAudio': true,
      'diagnostics': false
    })
    currentUneeq.initWithToken(response.data.token)
  }).catch((error) => {
    console.error(error)
  })


  return (
    <div className='App'>
      <div id='remoteVideo' style={{ width: '100%', height: '100%' }} />
    </div>
  );
}

export default App;
