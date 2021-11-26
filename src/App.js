import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';
import Particles from "react-tsparticles";



const initialState ={
    input: '',
    imageUrl:'',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }  
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

//Load the user at registration

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
      }
    })
  }
/*----------Connecting to front-end------------

  componentDidMount() {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(console.log)
  }
---------------------------------------------*/

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
      fetch('https://floating-hollows-63126.herokuapp.com/imageurl',{
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input 
      })
    })
    .then(response => response.json())

    .then(response => {
      if(response) {
        fetch('https://floating-hollows-63126.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
        })
      })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log);
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
      .catch(err => console.log(err)); 
    
}

onRouteChange = (route) => {
  if (route === 'signout'){
    this.setState(initialState)
  } else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}

render() {
  const { isSignedIn, imageUrl, route, box } = this.state;

const particlesInit = (main) => {
  console.log(main);

  // you can initialize the tsParticles instance (main) here, adding custom shapes or presets
};

const particlesLoaded = (container) => {
  //console.log(container);
};
return (
  <div className="App">
    <Particles className='particles'
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
             
        particles: {
          color: {
            value: "#FFFFFF",
          },
          links: {
            color: "#FFFFFF",
            distance: 150,
            blur:5,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 900,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            random: true,
            value: 5,
          },
        },
        detectRetina: true,
      }}
    />
 
    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
    { route === 'home'  
      ? <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
          />
          <FaceRecognition box={box} imageUrl={imageUrl} />
        </div>
    
      :(
        route === 'signin'
        ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )    
    }
  </div>
);
}
}
  

export default App
