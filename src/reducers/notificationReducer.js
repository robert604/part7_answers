
const initNotification = null

export const notificationReducer = (notification=initNotification,action) => {
  switch(action.type) {
  case 'SETNOTIFICATION':
    notification = action.notification
    return notification
  }
  return notification
}

export const setNotification = (notification) => {
  return {
    type: 'SETNOTIFICATION',
    notification: notification
  }
}

export const startNotification = notification => {
  return dispatch => {
    dispatch(setNotification(notification))
    setTimeout(() => {
      dispatch(setNotification(null))
    },5000)
  }

}