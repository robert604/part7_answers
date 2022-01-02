import { createStore } from 'redux'

const initNotification = null

const notificationReducer = (notification=initNotification,action) => {
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

export const notificationStore = createStore(notificationReducer)

export const startNotification = notification => {
  notificationStore.dispatch(setNotification(notification))
  setTimeout(() => {
    notificationStore.dispatch(setNotification(null))
  },5000)
}