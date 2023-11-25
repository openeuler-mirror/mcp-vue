
module.exports = [
  // user login
  {
    url: '/login',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'desc': '请求成功',
        'data': {}
      }
    }
  },

  {
    url: '/user/register',
    type: 'post',
    response: config => {
      return {
        'code': 200
      }
    }
  },

  {
    url: '/user/updateRealName',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'desc': 'error 123'
      }
    }
  },

  {
    url: '/user/updatePwd',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'desc': 'error 124'
      }
    }
  },

  // get user info
  {
    url: '/user/userInfo',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'data': {
          'roles': ['admin'],
          'introduction': 'I am a super administrator',
          'avatar': 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
          'name': 'Super Admin'
        }
      }
    }
  },

  // user logout
  {
    url: '/loginOut',
    type: 'post',
    response: _ => {
      return {
        code: 200,
        desc: 'success'
      }
    }
  }
]
