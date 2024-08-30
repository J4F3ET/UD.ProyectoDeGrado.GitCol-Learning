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

