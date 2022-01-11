import React from 'react'
import {
  useAuthenticated,
  Datagrid,
  TextField,
  DeleteButton,
  EditButton,
  List,
} from 'react-admin'

const Users = props => {
  useAuthenticated()

  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="email" />
        <EditButton basePath="/users" />
        <DeleteButton basePath="/users" />
      </Datagrid>
    </List>
  )
}

export default Users
