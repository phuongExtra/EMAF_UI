const Const = Object.freeze({
  BLACK_LIST: [
    'UserProfile',
    'UserProjectList',
    'UserCreateProject',
    'UserProjectPage',
    'UserInviteUser',
    'UserRecommendation'
  ],
  PRIVACY: {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
  },
  INVITATION_TYPE: {
    INVITATION: 'INVITATION',
    REQUEST: 'REQUEST'
  },
  USER_STATUS: {
    ACTIVE: 'ACTIVE',
    NEW_ACTIVE: 'NEW_ACTIVE',
    INACTIVE: 'INACTIVE',
    BLOCKED: 'BLOCKED'
  },
  USER_ROLE:{
    ROLE_MANAGER :'ROLE_MANAGER',
    ROLE_STAFF: 'ROLE_STAFF',
    ROLE_STUDENT : 'ROLE_STUDENT',
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_PARTICIPANT: 'ROLE_PARTICIPANT',
    ROLE_ORGANIZER:'ROLE_ORGANIZER',
    ROLE_COLLABORATOR:'ROLE_COLLABORATOR',
  },
  STARTUP_STATUS: {
    ACTIVE: 'ACTIVE',
    PUBLIC: 'PUBLIC',
    ACQUIRED: 'ACQUIRED',
    INACTIVE: 'INACTIVE'
  },
  USER_VERIFICATION_STATUS: {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
    EXPIRED: 'EXPIRED'
  },
  URL_TEMPLATE: {
    URL_STARTUP_EXCEL: 'https://fstartds.s3.ap-southeast-1.amazonaws.com/startups/template/Startup_template.xlsx'
  },
  REDIRECT_TYPE: {
    GOOGLE: 'google',
    VERIFY_EMAIL: 'verify_email'
  },
  EVENT_STATUS:{
    NEW: 'NEW',
    RUNNING: 'RUNNING',
    ACCEPTED:'ACCEPTED',
    PENDING:'PENDING',
    APPROVED:'APPROVED',
    REJECTED:'REJECTED',
    STOPPED:'STOPPED',
    FINISHED: 'FINISHED'
  },
  EVENT_OPTIONS_STATUS:["NEW",'PENDING','APPROVED','REJECTED','RUNNING','FINISHED', 'STOPPED'],
  EVENT_ONTIONS_TYPE:['ACADEMIC','GAMES','SPORTS','CULTURE','ARTS'],
  STATUS:{
    SUCCESS: "Successfully",
    FAIL:"Failed"
  },
})

export default Const
