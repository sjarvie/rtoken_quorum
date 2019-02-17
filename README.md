A permissioned security token standard which enables global issuance and trading of ERC20 digital assets compliant with offering and investor level regulation , while providing issuers with fined grained privacy controls and minimal exposure of underlying investor transaction data.

For the compliance aspect, we used the leading open source ERC20 security token standard, the R-Token, a RegulatedToken that checks the validity potential transfers against a RegulatorService. This R-Token then leverages the Quorum privacy platform by allowing issuers to share knowledge of state while remaining agnostic to each other's trades.

We deploy a RegulatorService contract which is private to nodes owned by the regulator and issuers of R-Tokens. The issuer-specific R-Token contracts and state are private to only the issuer and regulator, meaning though two issuers can share knowledge of investors essential to ensuring legal compliance, they will not be aware each other's issuances and secondary trades.

This allows for issuers to only view their own token balances and state, while querying a global regulator service when attempting to make a transaction, and for no public entity outside of the regulator to be able to view all issuer transactions.


Full details at submission page https://kauri.io/article/2a3279632e9c4cbbbe3bd40048023084/v2/rtoken-quorum-a-permissioned-security-token-platform
