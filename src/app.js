import React from 'react'
import {Admin, Resource} from 'react-admin'

import restProvider from 'ra-data-simple-rest'
import Users from './pages/users'

import UserEdit from './components/user/user-edit'
import UserCreate from './components/user/user-create'
import Login from './components/auth/login'
import {authProvider, httpClient} from './utils/auth-provider'

const App = () => {
  return (
    <Admin
      dataProvider={restProvider('http://localhost:5000/api', httpClient)}
      authProvider={authProvider}
      loginPage={Login}
    >
      <Resource name="users" list={Users} edit={UserEdit} create={UserCreate} />
    </Admin>
  )
}

export default App
