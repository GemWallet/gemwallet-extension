export const mockTransactions = [
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'r3Hd1bNLn4PuLFsKwMhfK8sig7tQcKkXJi',
              Balance: '979999928',
              Flags: 0,
              OwnerCount: 1,
              Sequence: 35320136
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '305943B19E70AB8F508058D67576BD263EA4402C5232E15D94E18052A3AEAA74',
            PreviousFields: {
              Balance: '999999940',
              Sequence: 35320135
            },
            PreviousTxnID: '8A40367A3F4BFFA45E1EDA4F4E3CD03BCC7C20366CA3D695CB9E13E3675FA638',
            PreviousTxnLgrSeq: 35325872
          }
        },
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rhikRdkFw28csKw9z7fVoBjWncz1HSoQij',
              Balance: '479993543',
              Flags: 0,
              OwnerCount: 4,
              Sequence: 34325154
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'ED3BE698EB952BF74DC1A42BEB30DBDABFE946914A7B1AC06213791755A68358',
            PreviousFields: {
              Balance: '459993543'
            },
            PreviousTxnID: '88B55BF2C181014ABDBEADBF6703945F1BAD7C47ED97A5138849D64DDD7D6764',
            PreviousTxnLgrSeq: 35320142
          }
        }
      ],
      TransactionIndex: 1,
      TransactionResult: 'tesSUCCESS',
      delivered_amount: '20000000'
    },
    tx: {
      Account: 'r3Hd1bNLn4PuLFsKwMhfK8sig7tQcKkXJi',
      Amount: '20000000',
      Destination: 'rhikRdkFw28csKw9z7fVoBjWncz1HSoQij',
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 35332317,
      Sequence: 35320135,
      SigningPubKey: 'ED40DB7D4322B72D47ECF6F4E2BB4DCFBF39A6ABF2DB03148F8ED1F1132FC42784',
      TransactionType: 'Payment',
      TxnSignature:
        '1ACCA4362FB75B7EEE36D224CD470005CC100FE561AAFB2083F9FD39F8A0C9AE80B2BE0465F6AA0CBF5308DCB758ED05506E9CD4367FB792E873158E41EB0108',
      date: 729538290,
      hash: '02F07E4C5FA312325D0A00F7823B6AD5CE0416A95ABD2038288914F4678D0B6F',
      inLedger: 35332299,
      ledger_index: 35332299
    },
    validated: true
  },
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rhikRdkFw28csKw9z7fVoBjWncz1HSoQij',
              Balance: '459993543',
              Flags: 0,
              OwnerCount: 4,
              Sequence: 34325154
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'ED3BE698EB952BF74DC1A42BEB30DBDABFE946914A7B1AC06213791755A68358',
            PreviousFields: {
              Balance: '459993555',
              Sequence: 34325153
            },
            PreviousTxnID: 'A51FF5E411248D77D92E1085DFAC3902401CE54C1924D3D0B415C83D4EA6A03F',
            PreviousTxnLgrSeq: 35320122
          }
        }
      ],
      TransactionIndex: 0,
      TransactionResult: 'tesSUCCESS'
    },
    tx: {
      Account: 'rhikRdkFw28csKw9z7fVoBjWncz1HSoQij',
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 35320160,
      LimitAmount: {
        currency: 'USD',
        issuer: 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN',
        value: '10000000'
      },
      Sequence: 34325153,
      SigningPubKey: 'ED320B639DE36DD5779AE0E41A1930889BCD09A667E1848C96E38C65FB9D1F77DA',
      TransactionType: 'TrustSet',
      TxnSignature:
        'E1D827FA13B3B46BAE3B235B54B014F59BA214E3AE806D1056AD4929A3EC05CD144658359A5E8990B8D2C7810DE3CBD5ED10BB4D948ABA599ED57F88D71D500D',
      date: 729499733,
      hash: '88B55BF2C181014ABDBEADBF6703945F1BAD7C47ED97A5138849D64DDD7D6764',
      inLedger: 35320142,
      ledger_index: 35320142
    },
    validated: true
  }
];
