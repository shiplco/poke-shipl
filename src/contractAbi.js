// const contractAbi = [
//   {
//     constant: true,
//     inputs: [
//       {
//         name: '',
//         type: 'address'
//       }
//     ],
//     name: 'owners',
//     outputs: [
//       {
//         name: '',
//         type: 'uint256'
//       }
//     ],
//     payable: false,
//     stateMutability: 'view',
//     type: 'function'
//   },
//   {
//     constant: false,
//     inputs: [
//       {
//         name: 'pokemon',
//         type: 'uint256'
//       }
//     ],
//     name: 'claim',
//     outputs: [],
//     payable: false,
//     stateMutability: 'nonpayable',
//     type: 'function'
//   }
// ]

const contractAbi = [
  {
    'constant': false,
    'inputs': [
      {
        'name': 'pokemon',
        'type': 'uint256'
      }
    ],
    'name': 'claim',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [
      {
        'name': 'pokemon',
        'type': 'uint256'
      },
      {
        'name': 'amount',
        'type': 'uint256'
      }
    ],
    'name': 'evolvePokemon',
    'outputs': [],
    'payable': true,
    'stateMutability': 'payable',
    'type': 'function'
  },
  {
    'constant': false,
    'inputs': [],
    'name': 'withdraw',
    'outputs': [],
    'payable': false,
    'stateMutability': 'nonpayable',
    'type': 'function'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'sender',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'pokemon',
        'type': 'uint256'
      }
    ],
    'name': 'Claim',
    'type': 'event'
  },
  {
    'anonymous': false,
    'inputs': [
      {
        'indexed': false,
        'name': 'sender',
        'type': 'address'
      },
      {
        'indexed': false,
        'name': 'pokemon',
        'type': 'uint256'
      },
      {
        'indexed': false,
        'name': 'value',
        'type': 'uint256'
      }
    ],
    'name': 'EvolvePokemon',
    'type': 'event'
  },
  {
    'constant': true,
    'inputs': [],
    'name': 'getBalance',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  },
  {
    'constant': true,
    'inputs': [
      {
        'name': '',
        'type': 'address'
      }
    ],
    'name': 'owners',
    'outputs': [
      {
        'name': '',
        'type': 'uint256'
      }
    ],
    'payable': false,
    'stateMutability': 'view',
    'type': 'function'
  }
]

export default contractAbi
