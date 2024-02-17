import { AccountTxTransaction } from 'xrpl';

export const mockTransactions = [
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Flags: 0,
              IndexPrevious: '13',
              Owner: 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN',
              RootIndex: 'CCEB67796D07A8C1E40DAA24D549A7F911B63B28B9F3C4C6652B6F970F85C174'
            },
            LedgerEntryType: 'DirectoryNode',
            LedgerIndex: '3EECA02A5439B273B0898FD25C5485C0DC19E807C4D1DCDB9AC317280B5CB143'
          }
        },
        {
          CreatedNode: {
            LedgerEntryType: 'DirectoryNode',
            LedgerIndex: '3EF64D8BDB28BF40BCC86FA1FEE30E1936A6A6CD5F47FF84116B48B00CD59517',
            NewFields: {
              Owner: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
              RootIndex: '3EF64D8BDB28BF40BCC86FA1FEE30E1936A6A6CD5F47FF84116B48B00CD59517'
            }
          }
        },
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
              Balance: '9949999964',
              FirstNFTokenSequence: 45473676,
              Flags: 0,
              MintedNFTokens: 1,
              OwnerCount: 2,
              Sequence: 45473678
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '62303A08E846D1C72535F4F2E4643ECB62A7474D4481EF73D1064E2DFFB01DC2',
            PreviousFields: {
              Balance: '9949999976',
              OwnerCount: 1,
              Sequence: 45473677
            },
            PreviousTxnID: '5B5CC68203CED2763893F088F913D3254D68F09B881F8EE7491ED6EFAE5A3A3E',
            PreviousTxnLgrSeq: 45473736
          }
        },
        {
          CreatedNode: {
            LedgerEntryType: 'RippleState',
            LedgerIndex: 'B40FA21B84B3F33D13224BE446D87BDDB4BB7A82415B0D3888EDF8F01C3E3BCB',
            NewFields: {
              Balance: {
                currency: 'USD',
                issuer: 'rrrrrrrrrrrrrrrrrrrrBZbvji',
                value: '0'
              },
              Flags: 2228224,
              HighLimit: {
                currency: 'USD',
                issuer: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
                value: '1000000'
              },
              LowLimit: {
                currency: 'USD',
                issuer: 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN',
                value: '0'
              },
              LowNode: '14'
            }
          }
        },
        {
          ModifiedNode: {
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: 'D306EAC125ABC5434050CAC5444C8DAF1DD67C49BC93276242E03904D3EB588F',
            PreviousTxnID: '679E6E07D31228D8466D6210F9DB3648539CFA91390D008C95645C0C293B369B',
            PreviousTxnLgrSeq: 44714449
          }
        }
      ],
      TransactionIndex: 1,
      TransactionResult: 'tesSUCCESS'
    },
    tx: {
      Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
      Fee: '12',
      Flags: 131072,
      LastLedgerSequence: 45473762,
      LimitAmount: {
        currency: 'USD',
        issuer: 'rwtDvu9QDfCskWuyE2TSEt3s56RbiWUKJN',
        value: '1000000'
      },
      Sequence: 45473677,
      SigningPubKey: 'EDA98D497A8849719B4352518E0C72A9F797B51420CD93635A667DF888CD648868',
      TransactionType: 'TrustSet',
      TxnSignature:
        'F2AC2B8BD00A18311CA4AFCA271C3DD08530BD2A5E61F16777A542BB03CA8B6B4A6E618F8C610E45DC18D51713174EB539D7651A1AED1A655A457E4698076102',
      date: 761489290,
      hash: '05544009627ECF570707221100E9699B1185D4028CCFF43CAED83A4E4F2F3641',
      inLedger: 45473744,
      ledger_index: 45473744
    },
    validated: true
  },
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
              Balance: '9949999976',
              FirstNFTokenSequence: 45473676,
              Flags: 0,
              MintedNFTokens: 1,
              OwnerCount: 1,
              Sequence: 45473677
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '62303A08E846D1C72535F4F2E4643ECB62A7474D4481EF73D1064E2DFFB01DC2',
            PreviousFields: {
              Balance: '9949999988',
              OwnerCount: 0,
              Sequence: 45473676
            },
            PreviousTxnID: '67BAF225007D5E4FF66761044DFE9371F0E6E7145116BA59EAB40A9A28B9D392',
            PreviousTxnLgrSeq: 45473730
          }
        },
        {
          CreatedNode: {
            LedgerEntryType: 'NFTokenPage',
            LedgerIndex: 'F5726A3B64D5C433A1854A69B5790561E4ADF8DAFFFFFFFFFFFFFFFFFFFFFFFF',
            NewFields: {
              NFTokens: [
                {
                  NFToken: {
                    NFTokenID: '000A0BB8F5726A3B64D5C433A1854A69B5790561E4ADF8DA7E73352702B5DF8C',
                    URI: '4D696E746564207468726F7567682047656D57616C6C657421'
                  }
                }
              ]
            }
          }
        }
      ],
      TransactionIndex: 1,
      TransactionResult: 'tesSUCCESS',
      nftoken_id: '000A0BB8F5726A3B64D5C433A1854A69B5790561E4ADF8DA7E73352702B5DF8C'
    },
    tx: {
      Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
      Fee: '12',
      Flags: 10,
      LastLedgerSequence: 45473754,
      Memos: [
        {
          Memo: {
            MemoData: '54657374206D656D6F',
            MemoType: '4465736372697074696F6E'
          }
        }
      ],
      NFTokenTaxon: 0,
      Sequence: 45473676,
      SigningPubKey: 'EDA98D497A8849719B4352518E0C72A9F797B51420CD93635A667DF888CD648868',
      TransactionType: 'NFTokenMint',
      TransferFee: 3000,
      TxnSignature:
        '25A9CC5A78E6AF505118BECE2EEC2C2E1FF44CD30D88BC21617F9C575CC12AB8E231AF5139C1EBA6649A96837D0D17FED47F9E012F20BBF44585B68708BAE305',
      URI: '4D696E746564207468726F7567682047656D57616C6C657421',
      date: 761489262,
      hash: '5B5CC68203CED2763893F088F913D3254D68F09B881F8EE7491ED6EFAE5A3A3E',
      inLedger: 45473736,
      ledger_index: 45473736
    },
    validated: true
  },
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rMrXopFSnCDSd5Eej4TpeHrV7SPjKtLpo2',
              Balance: '5110000150',
              Flags: 0,
              OwnerCount: 0,
              Sequence: 32441114
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '3AD90E6733C529A44CCAA383B3EA60738057EC042FEB5195BF021CDD1688C6DC',
            PreviousFields: {
              Balance: '5060000150'
            },
            PreviousTxnID: '820F05D153DD027D3D4049E848F83C8008827EF68D474130B80B1F0D7D5A6358',
            PreviousTxnLgrSeq: 45443813
          }
        },
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
              Balance: '9949999988',
              Flags: 0,
              OwnerCount: 0,
              Sequence: 45473676
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '62303A08E846D1C72535F4F2E4643ECB62A7474D4481EF73D1064E2DFFB01DC2',
            PreviousFields: {
              Balance: '10000000000',
              Sequence: 45473675
            },
            PreviousTxnID: '2124CD469DC2325039934C02E186996922038608F5A1D79F545092AD1F28A26B',
            PreviousTxnLgrSeq: 45473675
          }
        }
      ],
      TransactionIndex: 1,
      TransactionResult: 'tesSUCCESS',
      delivered_amount: '50000000'
    },
    tx: {
      Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
      Amount: '50000000',
      DeliverMax: '50000000',
      Destination: 'rMrXopFSnCDSd5Eej4TpeHrV7SPjKtLpo2',
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 45473748,
      Sequence: 45473675,
      SigningPubKey: 'EDA98D497A8849719B4352518E0C72A9F797B51420CD93635A667DF888CD648868',
      TransactionType: 'Payment',
      TxnSignature:
        '3639FBF7CB5FC95C3843AE9350295A5C5BFDAA0140B1982413C8B4F20557AAF37DAEACDB38901A3BA30FC41100D52376083D917A6F58A2BFB8BF1514D4B4B300',
      date: 761489180,
      hash: '67BAF225007D5E4FF66761044DFE9371F0E6E7145116BA59EAB40A9A28B9D392',
      inLedger: 45473730,
      ledger_index: 45473730
    },
    validated: true
  },
  {
    meta: {
      AffectedNodes: [
        {
          ModifiedNode: {
            FinalFields: {
              Account: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
              Balance: '59546638909059252',
              Flags: 0,
              OwnerCount: 161,
              Sequence: 9923202,
              TicketCount: 161
            },
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '31CCE9D28412FF973E9AB6D0FA219BACF19687D9A2456A0C2ABC3280E9D47E37',
            PreviousFields: {
              Balance: '59546648909059264',
              OwnerCount: 162,
              TicketCount: 162
            },
            PreviousTxnID: '5717775A5C2C901B3094100AB2C73CE5A3299D7DBC9FB1475AA8920ECFFD6E84',
            PreviousTxnLgrSeq: 45473675
          }
        },
        {
          CreatedNode: {
            LedgerEntryType: 'AccountRoot',
            LedgerIndex: '62303A08E846D1C72535F4F2E4643ECB62A7474D4481EF73D1064E2DFFB01DC2',
            NewFields: {
              Account: 'rP4oc6rCDNQmcohYVUhY5uRJ6w6ytsacGq',
              Balance: '10000000000',
              Sequence: 45473675
            }
          }
        },
        {
          ModifiedNode: {
            FinalFields: {
              Flags: 0,
              IndexNext: '7dd',
              IndexPrevious: '7db',
              Owner: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
              RootIndex: '781518F4E11A068CB35BF18DA3CBEC220E6CDAF406131C56368453759252A78D'
            },
            LedgerEntryType: 'DirectoryNode',
            LedgerIndex: '82F02EF4619EF99586D6359FE9CFB41F74BD27AEE8C423BF07BAE96801066284'
          }
        },
        {
          DeletedNode: {
            FinalFields: {
              Account: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
              Flags: 0,
              OwnerNode: '7dc',
              PreviousTxnID: '1039742A110FB7D6616A03D7262EB375628D7B8F7EB5FABE5D018BA4EBC698A0',
              PreviousTxnLgrSeq: 45473339,
              TicketSequence: 9922974
            },
            LedgerEntryType: 'Ticket',
            LedgerIndex: 'DA870739092372EA3350C0BF1FB1880A86B491CB3AE6AFA5415F2326A635A4B9'
          }
        }
      ],
      TransactionIndex: 1,
      TransactionResult: 'tesSUCCESS',
      delivered_amount: '10000000000'
    },
    tx: {
      Account: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
      Amount: '10000000000',
      DeliverMax: '10000000000',
      Destination: 'rbeE8tU61ks2GiN2FqoDAdVu9GaUpntp1',
      Fee: '12',
      Flags: 0,
      LastLedgerSequence: 45473693,
      Sequence: 0,
      SigningPubKey: '02356E89059A75438887F9FEE2056A2890DB82A68353BE9C0C0C8F89C0018B37FC',
      TicketSequence: 9922974,
      TransactionType: 'Payment',
      TxnSignature:
        '3044022041474FFC777F57D62A0D85CE32E966E52CFDC50834C91DE1D2448CC2D7BDD8DB0220049ABDA26247D88F1789D93C6D0F4982EA24EB35D5E11460A828C46545571FA0',
      date: 761489080,
      hash: '2124CD469DC2325039934C02E186996922038608F5A1D79F545092AD1F28A26B',
      inLedger: 45473675,
      ledger_index: 45473675
    },
    validated: true
  }
  // Casting as AccountTxTransaction[] as there are still some wrong typing on XRPL JS.
] as AccountTxTransaction[];
