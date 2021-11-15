/* eslint no-undef: "off" */

/*
This script will only run if there is no existing database.
To trigger on subsequent Docker builds, make sure to run
`docker volume rm ussf-portal-client-mongodb_data_container`

The variable 'db' refers to the $MONGO_INITDB_DATABASE
variable declared in the MongoDB Docker container in docker-compose.yml

*/

print('✅ Connected to database: ', db)

db.createCollection('users')

const exampleCollection1 = {
  title: 'Example Collection',
  _id: new ObjectId(),
  bookmarks: [
    {
      _id: new ObjectId(),
      url: 'https://google.com',
      label: 'Webmail',
      description: 'Lorem ipsum',
    },
    {
      _id: new ObjectId(),
      url: 'https://mypay.dfas.mil/#/',
      label: 'MyPay',
      description: 'Lorem ipsum',
    },
    {
      _id: new ObjectId(),
      url: 'https://afpcsecure.us.af.mil/PKI/MainMenu1.aspx',
      label: 'vMPF',
      description: 'Lorem ipsum',
    },
    {
      _id: new ObjectId(),
      url: 'https://leave.af.mil/profile',
      label: 'LeaveWeb',
      description: 'Lorem ipsum',
    },
    {
      _id: new ObjectId(),
      url: 'https://www.e-publishing.af.mil/',
      label: 'e-Publications',
      description: 'Lorem ipsum',
    },
  ],
}

const exampleCollection2 = {
  title: 'Second Collection',
  _id: new ObjectId(),
  bookmarks: [
    {
      _id: new ObjectId(),
      url: 'https://google.com',
      label: 'Search Engine',
      description: 'Lorem ipsum',
    },
  ],
}

const exampleUser = {
  commonName: 'HALL.MICHAEL.0123456789',
  isBeta: true,
  mySpace: [exampleCollection1, exampleCollection2],
}

db.users.insertOne(exampleUser)