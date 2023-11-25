module.exports = [
  {
    url: '/dept/queryDeptList',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'desc': '请求成功',
        'data': [
          {
            'deptId': 1,
            'deptName': '研发二部',
            'parentId': 0,
            'childDepts': [
              {
                'deptId': 2,
                'deptName': '虚拟化小组',
                'parentId': 1,
                'childDepts': [
                  {
                    'deptId': 4,
                    'deptName': '虚拟化前端',
                    'parentId': 2,
                    'childDepts': []
                  },
                  {
                    'deptId': 6,
                    'deptName': '虚拟化后端',
                    'parentId': 2,
                    'childDepts': []
                  }
                ]
              },
              {
                'deptId': 3,
                'deptName': '云桌面',
                'parentId': 1,
                'childDepts': []
              }
            ]
          },
          {
            'deptId': 5,
            'deptName': '研发一部',
            'parentId': 0,
            'childDepts': []
          }
        ]
      }
    }
  },
  {
    url: '/org/queryOrgList',
    type: 'post',
    response: config => {
      return {
        'code': 200,
        'desc': '请求成功',
        'data': [
          {
            'organizationId': 1,
            'organizationName': '麒麟信安',
            'parentId': 0,
            'childOrgs': [
              {
                'organizationId': 2,
                'organizationName': '陕西麒麟',
                'parentId': 1,
                'childOrgs': []
              },
              {
                'organizationId': 3,
                'organizationName': '研发一部',
                'parentId': 1,
                'childOrgs': []
              }
            ]
          }
        ]
      }
    }
  }
]

