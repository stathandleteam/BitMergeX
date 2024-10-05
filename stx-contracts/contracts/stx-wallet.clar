;; title: stx-wallet
;; version:
;; summary: 
;; description:

;; constants
(define-constant OWNER 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM) ;; Fixed contract owner set during deployment.
(define-constant CONTRACT 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-wallet)

;; (define-constant OWNER tx-sender)
;; (define-constant CONTRACT (as-contract OWNER))

;; public functions
;; Depositing STX into the contract
(define-public (deposit (amount uint))
   (begin
     (asserts! (>= (stx-get-balance tx-sender) amount) (err u491)) ;; Ensure the sender has enough balance.
     (try! (stx-transfer? amount tx-sender CONTRACT)) ;; Transfer STX to the contract.
     (print {event: "deposit", from: tx-sender, recipient: CONTRACT, amount: amount}) ;; Log the event.
     (ok true)
   )
)

;; Handling external STX purchases
(define-public (buy-stx (amount uint))
   (begin
     ;; Log purchase event
     (ok (print {event: "buy-stx", purchaser: tx-sender, amount: amount}))
   )
)

;; Transfer STX from the contract to a principal
(define-public (contract-transfer (amount uint) (to principal))
   (begin
      (asserts! (not (is-eq (some to) none)) (err u2))
     (asserts! (is-eq CONTRACT contract-caller) (err u403)) ;; Ensure contract-caller is the contract.
     (asserts! (>= (stx-get-balance CONTRACT) amount) (err u405)) ;; Check contract's balance.
     (try! (stx-transfer? amount CONTRACT to)) ;; Transfer STX from contract to 'to'.
     (ok (print {event: "contract-transfer", amount: amount, to: to})) ;; Log the event.
   )
)

;; Transfer STX from one principal to another with an optional memo
(define-public (send-stx (amount uint) (sender principal) (recipient principal) )
   (begin
      (asserts! (not (is-eq (some recipient) none)) (err u2))

     (asserts! (is-eq sender contract-caller) (err u403)) ;; Ensure caller is the sender.
     (asserts! (>= (stx-get-balance sender) amount) (err u491)) ;; Check sender's balance.
     (try! (stx-transfer? amount sender recipient)) ;; Perform the transfer.
     ;; Log the event and memo (if present)
     (print {event: "send-stx", amount: amount, from: sender, to: recipient, balance: (get-balance sender)})
     (ok true)
  )
)

(define-public (send-stx-memo (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
	(begin
      ;;   If a memo exists, check its length
      (match memo to-print
         (asserts! (<= (len to-print) u34) (err u413)) ;; Ensure memo is not larger than 34 bytes.
         true
      )
		(try! (send-stx amount sender recipient))
		(print memo)
		(ok true)
	)
)

(define-private (send-stx-many-iter (item {amount: uint, sender: principal, recipient: principal}) (previous-response (response bool uint)))
	(match previous-response prev-ok (send-stx (get amount item) (get sender item) (get recipient item)) prev-err previous-response)
)

(define-public (send-stx-many (transfers (list 200 {amount: uint, sender: principal, recipient: principal})))
	(fold send-stx-many-iter transfers (ok true))
)

(define-private (send-stx-many-memo-iter (item {amount: uint, sender: principal, recipient: principal, memo: (optional (buff 34))}) (previous-response (response bool uint)))
	(match previous-response prev-ok (send-stx-memo (get amount item) (get sender item) (get recipient item) (get memo item)) prev-err previous-response)
)

(define-public (send-stx-many-memo (transfers (list 200 {amount: uint, sender: principal, recipient: principal, memo: (optional (buff 34))})))
	(fold send-stx-many-memo-iter transfers (ok true))
)

;; Read-only function to get the owner's balance
(define-read-only (get-balance (who principal))
   (stx-get-balance who)
)

;; Read-only function to get the contract's balance
(define-read-only (get-contract-balance)
    (if (is-eq OWNER contract-caller)
         (stx-get-balance (as-contract tx-sender))
         u401
    )  
)