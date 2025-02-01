export type NftProgram = {
  version: "0.1.0";
  name: "nft_program";
  instructions: [
    {
      name: "mintCnft";
      accounts: [
        {
          name: "treeAuthority";
          isMut: true;
          isSigner: false;
        },
        {
          name: "leafOwner";
          isMut: true;
          isSigner: true;
        },
        {
          name: "leafDelegate";
          isMut: true;
          isSigner: true;
        },
        {
          name: "merkleTree";
          isMut: true;
          isSigner: false;
        },
        {
          name: "payer";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "logWrapper";
          isMut: false;
          isSigner: false;
        },
        {
          name: "compressionProgram";
          isMut: false;
          isSigner: false;
        },
        {
          name: "mintRecord";
          isMut: true;
          isSigner: false;
        },
        {
          name: "bubblegumProgram";
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: "name";
          type: "string";
        },
        {
          name: "symbol";
          type: "string";
        },
        {
          name: "uri";
          type: "string";
        },
        {
          name: "jimpAllocation";
          type: "u64";
        },
      ];
    },
  ];
  types: [
    {
      name: "MetadataArgs";
      type: {
        kind: "struct";
        fields: [
          {
            name: "name";
            type: "string";
          },
          {
            name: "symbol";
            type: "string";
          },
          {
            name: "uri";
            type: "string";
          },
          {
            name: "collectionKey";
            type: {
              option: "publicKey";
            };
          },
          {
            name: "creators";
            type: {
              vec: {
                defined: "Creator";
              };
            };
          },
          {
            name: "editionNonce";
            type: {
              option: "u8";
            };
          },
          {
            name: "uses";
            type: {
              option: {
                defined: "Uses";
              };
            };
          },
          {
            name: "primarySaleHappened";
            type: "bool";
          },
          {
            name: "isMutable";
            type: "bool";
          },
          {
            name: "sellerFeeBasisPoints";
            type: "u16";
          },
        ];
      };
    },
    {
      name: "Creator";
      type: {
        kind: "struct";
        fields: [
          {
            name: "address";
            type: "publicKey";
          },
          {
            name: "verified";
            type: "bool";
          },
          {
            name: "share";
            type: "u8";
          },
        ];
      };
    },
    {
      name: "Uses";
      type: {
        kind: "struct";
        fields: [
          {
            name: "useMethod";
            type: {
              defined: "UseMethod";
            };
          },
          {
            name: "remaining";
            type: "u64";
          },
          {
            name: "total";
            type: "u64";
          },
        ];
      };
    },
    {
      name: "UseMethod";
      type: {
        kind: "enum";
        variants: [
          {
            name: "Burn";
          },
          {
            name: "Multiple";
          },
          {
            name: "Single";
          },
        ];
      };
    },
    {
      name: "MintError";
      type: {
        kind: "enum";
        variants: [
          {
            name: "InvalidMetadata";
          },
          {
            name: "InvalidAllocation";
          },
          {
            name: "MintFailed";
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: "InvalidMetadata";
      msg: "Invalid metadata provided";
    },
    {
      code: 6001;
      name: "InvalidAllocation";
      msg: "Invalid allocation amount";
    },
    {
      code: 6002;
      name: "InvalidMerkleTree";
      msg: "Invalid merkle tree";
    },
    {
      code: 6003;
      name: "MintFailed";
      msg: "Mint failed";
    },
  ];
};

export const IDL: NftProgram = {
  version: "0.1.0",
  name: "nft_program",
  instructions: [
    {
      name: "mintCnft",
      accounts: [
        {
          name: "treeAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leafOwner",
          isMut: true,
          isSigner: true,
        },
        {
          name: "leafDelegate",
          isMut: true,
          isSigner: true,
        },
        {
          name: "merkleTree",
          isMut: true,
          isSigner: false,
        },
        {
          name: "payer",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "logWrapper",
          isMut: false,
          isSigner: false,
        },
        {
          name: "compressionProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "mintRecord",
          isMut: true,
          isSigner: false,
        },
        {
          name: "bubblegumProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "symbol",
          type: "string",
        },
        {
          name: "uri",
          type: "string",
        },
        {
          name: "jimpAllocation",
          type: "u64",
        },
      ],
    },
  ],
  types: [
    {
      name: "MetadataArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "symbol",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "collectionKey",
            type: {
              option: "publicKey",
            },
          },
          {
            name: "creators",
            type: {
              vec: {
                defined: "Creator",
              },
            },
          },
          {
            name: "editionNonce",
            type: {
              option: "u8",
            },
          },
          {
            name: "uses",
            type: {
              option: {
                defined: "Uses",
              },
            },
          },
          {
            name: "primarySaleHappened",
            type: "bool",
          },
          {
            name: "isMutable",
            type: "bool",
          },
          {
            name: "sellerFeeBasisPoints",
            type: "u16",
          },
        ],
      },
    },
    {
      name: "Creator",
      type: {
        kind: "struct",
        fields: [
          {
            name: "address",
            type: "publicKey",
          },
          {
            name: "verified",
            type: "bool",
          },
          {
            name: "share",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "Uses",
      type: {
        kind: "struct",
        fields: [
          {
            name: "useMethod",
            type: {
              defined: "UseMethod",
            },
          },
          {
            name: "remaining",
            type: "u64",
          },
          {
            name: "total",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "UseMethod",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Burn",
          },
          {
            name: "Multiple",
          },
          {
            name: "Single",
          },
        ],
      },
    },
    {
      name: "MintError",
      type: {
        kind: "enum",
        variants: [
          {
            name: "InvalidMetadata",
          },
          {
            name: "InvalidAllocation",
          },
          {
            name: "MintFailed",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidMetadata",
      msg: "Invalid metadata provided",
    },
    {
      code: 6001,
      name: "InvalidAllocation",
      msg: "Invalid allocation amount",
    },
    {
      code: 6002,
      name: "InvalidMerkleTree",
      msg: "Invalid merkle tree",
    },
    {
      code: 6003,
      name: "MintFailed",
      msg: "Mint failed",
    },
  ],
};
