use crate::*;

#[near_bindgen]
impl Contract {

    #[payable]
    pub fn nft_upgrade(&mut self,
                        input_token_id1: TokenId,
                        input_token_id2: TokenId,
                        output_token_id: TokenId,
                        approval_id: Option<U64>
    ){
        assert_one_yocto();

        let input_token1 = self.nft_token(input_token_id1.clone()).expect("Token 1 not found");
        assert!(input_token1.approved_account_ids.len() == 0, "Token 1 already approved on a marketplace. Abort");
        let input_token2 = self.nft_token(input_token_id2.clone()).expect("Token 2 not found");
        assert!(input_token2.approved_account_ids.len() == 0, "Token 2 already approved on a marketplace. Abort");
        let output_token = self.nft_token(output_token_id.clone()).expect("Token 3 not found");

        assert_eq!(output_token.owner_id, self.owner_id, "Requested token already has an owner");

        let predecessor_account_id = env::predecessor_account_id();
        assert_eq!(input_token1.owner_id, predecessor_account_id, "Upgrade your own tokens only");
        assert_eq!(input_token2.owner_id, predecessor_account_id, "Upgrade your own tokens only");
        assert_eq!(input_token1.metadata.generation, input_token2.metadata.generation, "Upgrade tokens with the same generation only");
        assert_eq!(input_token1.metadata.generation + 1, output_token.metadata.generation, "Output token generation is wrong");


        self.internal_remove(&predecessor_account_id, &input_token_id1, approval_id);
        self.internal_remove(&predecessor_account_id, &input_token_id2, approval_id);
        let meta = Some(format!("Upgraded from {} & {}", input_token_id1, input_token_id2));
        let master_account_id = self.owner_id.clone();
        self.internal_transfer(&master_account_id, &predecessor_account_id, &output_token_id, approval_id, meta);
    }


    #[payable]
    pub fn nft_mint(
        &mut self,
        token_id: Option<TokenId>,
        metadata: TokenMetadata,
        perpetual_royalties: Option<HashMap<AccountId, u32>>,
        receiver_id: Option<ValidAccountId>,
        token_type: Option<TokenType>,
    ) {
        assert_eq!(self.owner_id, env::predecessor_account_id(), "Public mint disabled");

        assert!(metadata.generation > 0, "Token generation is missing");

        let mut final_token_id = format!("{}", self.token_metadata_by_id.len() + 1);
        if let Some(token_id) = token_id {
            final_token_id = token_id
        }

        let mut owner_id = env::predecessor_account_id();
        if let Some(receiver_id) = receiver_id {
            owner_id = receiver_id.into();
        }

        let pay_for_storage =  self.use_storage_fees || !self.is_free_mint_available(owner_id.clone());

        let initial_storage_usage = if pay_for_storage {
            env::storage_usage()
        }
        else {
            0
        };

        // CUSTOM - create royalty map
        let mut royalty = HashMap::new();
        let mut total_perpetual = 0;
        // user added perpetual_royalties (percentage paid with every transfer)
        if let Some(perpetual_royalties) = perpetual_royalties {
            assert!(perpetual_royalties.len() < 7, "Cannot add more than 6 perpetual royalty amounts");
            for (account, amount) in perpetual_royalties {
                royalty.insert(account, amount);
                total_perpetual += amount;
            }
        }
        // royalty limit for minter capped at 90%
        assert!(total_perpetual <= MINTER_ROYALTY_CAP, "Perpetual royalties cannot be more than 90%");

        // CUSTOM - enforce minting caps by token_type 
        if token_type.is_some() {
            let token_type = token_type.clone().unwrap();
            let cap = u64::from(*self.supply_cap_by_type.get(&token_type).expect("Token type must have supply cap."));
            let supply = u64::from(self.nft_supply_for_type(&token_type));
            assert!(supply < cap, "Cannot mint anymore of token type.");
            let mut tokens_per_type = self
                .tokens_per_type
                .get(&token_type)
                .unwrap_or_else(|| {
                    UnorderedSet::new(
                        StorageKey::TokensPerTypeInner {
                            token_type_hash: hash_account_id(&token_type),
                        }
                        .try_to_vec()
                        .unwrap(),
                    )
                });
            tokens_per_type.insert(&final_token_id);
            self.tokens_per_type.insert(&token_type, &tokens_per_type);
        }
        // END CUSTOM

        let token = Token {
            owner_id: owner_id.clone(),
            approved_account_ids: Default::default(),
            next_approval_id: 0,
            royalty,
            token_type,
        };
        assert!(
            self.tokens_by_id.insert(&final_token_id, &token).is_none(),
            "Token already exists"
        );
        self.token_metadata_by_id.insert(&final_token_id, &metadata);
        self.internal_add_token_to_owner(&token.owner_id, &final_token_id);

        match self.tokens_per_creator.get(&owner_id.clone()) {
            Some(mut tokens) => {
                tokens.insert(&final_token_id);
                self.tokens_per_creator.insert(&owner_id, &tokens);
            }
            None => {
                let mut tokens = UnorderedSet::new(
                    StorageKey::TokenPerCreatorInner {
                        account_id_hash: hash_account_id(&owner_id),
                    }
                        .try_to_vec()
                        .unwrap(),
                );
                tokens.insert(&final_token_id);
                self.tokens_per_creator.insert(&owner_id, &tokens);
            }
        }

        if pay_for_storage {
            let new_token_size_in_bytes = env::storage_usage() - initial_storage_usage;
            let required_storage_in_bytes =
                self.extra_storage_in_bytes_per_token + new_token_size_in_bytes;

            refund_deposit(required_storage_in_bytes);
        }
    }
}