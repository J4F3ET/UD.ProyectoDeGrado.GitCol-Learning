const driver =window.driver.js.driver;
const defaultUsageModelSteps = [
  {
    popover: {
      title: 'Welcome',
      description: 'This tutorial will guide you through the use of our tool'
    }
  },
  {
    element: '#inputContainer',
    popover: {
      title: 'Enter your command here',
      description: 'Write command and press \'enter\'',
      side: "left",
      align: 'start'
    }
  },
  {
    element: window.innerWidth > 1106 ?'#logContainer':"#controlBoxContainer",
    popover: {
      title: 'Command log',
      description: 'Here are shown the commands, errors and help information.',
      side: "bottom",
      align: 'center'
    }
  },  
]
const getDriver = (steps) => driver(
  {
    popoverClass: 'driverjs-theme',
    showProgress: true,
    steps:steps
  }
)
export const driveUsageMode = (...steps) => {
  if(!steps.length)
    return getDriver(defaultUsageModelSteps)
  return getDriver([...defaultUsageModelSteps,...steps])
};
const helpRooms = [
  {
    element: '#inputCodeRoomToLogin',
    popover: {
      title: 'Enter your code to room',
      description: 'Write code and press \'enter\'. Example \'ASDF\'',
      side: "left",
      align: 'start'
    }
  },
  {
    element: '#listRequirementsRoomLogin',
    popover: {
      title: 'Verify requirements',
      description: 'The code must meet the following requirements. Example \'ASDF\'',
      side: "left",
      align: 'start'
    }
  },
  {
    element: '#btnLoginToRoom',
    popover: {
      title: 'Button login',
      description: 'If the code is valid, the button to click on it will be enabled.Example \'ASDF\'',
      side: "left",
      align: 'start'
    }
  },
  {
    element: '#btnFindRoom',
    popover: {
      title: 'Search room',
      description: 'If for some reason you cannot find the room, try searching in the public rooms.',
      side: "left",
      align: 'start'
    }
  }
]
export const driveHelpRoom = (...steps) =>{
  if(!steps.length)
    return getDriver(helpRooms,)
  return getDriver([...helpRooms,...steps])
};
