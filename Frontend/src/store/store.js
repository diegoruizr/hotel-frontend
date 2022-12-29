const store = {
  state: {
    encrypt: localStorage.getItem('encrypt'),
    user: localStorage.getItem('user'),
    access_token: localStorage.getItem('access_token'),
    profile: localStorage.getItem('profile'),
    company: localStorage.getItem('company'),
    permissions: null,
    ip_server: '44.210.163.28/hotel-backend/Backend/public',
    profile_name: localStorage.getItem('profile_name'),
    company_name: localStorage.getItem('company_name'),
    company_id: localStorage.getItem('company_id'),
    events: []
  },
  getters: {
    getEncrypt: state => {
      return state.encrypt
    },
    getUser: state => {
      return state.user
    },
    getAccessToken: state => {
      return state.access_token
    },
    getCompany: state => {
      return state.company
    },
    getProfile: state => {
      return state.profile
    },
    getIpServer: state => {
      return state.ip_server
    },
    getPermissions: state => {
      return state.permissions
    },
    comparePermissions: (state) => (view) => {
      return state.permissions.find(permission => permission.view === view) !== undefined
    },
    getProfileName: state => {
      return state.profile_name
    },
    getCompanyName: state => {
      return state.company_name
    },
    getCompanyId: state => {
      return state.company_id
    },
    EVENTS: state => state.events
  },
  mutations: {
    setUser: (state, payload) => {
      state.user = payload
    },
    setCompany: (state, payload) => {
      state.company = payload
    },
    setProfile: (state, payload) => {
      state.profile = payload
    },
    setAccessToken: (state, payload) => {
      state.access_token = payload
    },
    setPermissions: (state, payload) => {
      state.permissions = payload
    },
    setCompanyName: (state, payload) => {
      state.company_name = payload
    },
    setCompanyId: (state, payload) => {
      state.company_id = payload
    },
    setProfileName: (state, payload) => {
      state.profile_name = payload
    },
    checkAllUser: (state) => {
      // console.log('METODO asdfasdfasdfasdfasdf')
    },
    encryptData: (state, data) => {
      var obj = JSON.stringify(JSON.parse(JSON.stringify(data)))
      let scape = window.btoa(unescape(encodeURIComponent(obj)))
      let repla = scape.split('Z').join('*')
      repla = repla.split('A').join('!')
      repla = repla.split('a').join('?')
      repla = repla.split('e').join('#')
      repla = repla.split('E').join('¡')
      repla = repla.split('I').join('$')
      repla = repla.split('o').join('-')
      repla = repla.split('O').join('_')
      repla = repla.split('u').join('°')
      repla = repla.split('U').join(',')
      repla = repla.split('b').join('.')
      repla = repla.split('B').join('[')
      repla = repla.split('c').join(']')
      repla = repla.split('C').join('´')
      repla = repla.split('n').join('+')
      repla = repla.split('N').join('~')
      repla = repla.split('d').join('^')
      repla = repla.split('D').join('`')
      state.encrypt = repla
    },
    ADD_EVENT: (state, event) => {
      state.events.push(event)
    },
    REMOVE_EVENT: (state, event) => {
      while (state.events.length) state.events.pop()
    },
    UPDATE_EVENT: (state, {id, title, start, end}) => {
      for (let index = 0; index < state.events.length; index++) {
        if (state.events[index].title === title) {
          state.events.splice(index, 1)
        }
      }
    }
  },
  actions: {
  }
}
export default store
