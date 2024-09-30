;; title: stx-wallet
;; version:
;; summary: 
;; description:

;; constants
;; (define-constant OWNER 'SPXXXXXXXXXXXXXXXXXXXXXX) ;; Fixed contract owner set during deployment.
(define-constant OWNER tx-sender)
(define-constant CONTRACT (as-contract tx-sender))

;; public functions

;; Depositing STX into the contract
(define-public (deposit (amount uint))
   (begin
     (asserts! (>= (stx-get-balance tx-sender) amount) (err u491)) ;; Ensure the sender has enough balance.
     (try! (stx-transfer? amount tx-sender CONTRACT)) ;; Transfer STX to the contract.
     (ok (print {event: "deposit", from: tx-sender, amount: amount})) ;; Log the event.
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
(define-public (send-stx (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
   (begin
      (asserts! (not (is-eq (some recipient) none)) (err u2))

     (asserts! (is-eq sender contract-caller) (err u403)) ;; Ensure caller is the sender.
     (asserts! (>= (stx-get-balance sender) amount) (err u491)) ;; Check sender's balance.
     ;; If a memo exists, check its length
     (match memo to-print
       (asserts! (<= (len to-print) u34) (err u413)) ;; Ensure memo is not larger than 34 bytes.
       true
     )
     (try! (stx-transfer? amount sender recipient)) ;; Perform the transfer.
     ;; Log the event and memo (if present)
     (ok (print {event: "send-stx", amount: amount, from: sender, to: recipient, memo: memo}))
  )
)

;; Read-only function to get the owner's balance
(define-read-only (get-balance (who principal))
   (ok (stx-get-balance who))
)

;; Read-only function to get the contract's balance
(define-read-only (get-contract-balance)
   (begin
      (asserts! (is-eq CONTRACT contract-caller) (err u403)) ;; Ensure contract-caller is the contract.  
      (ok (stx-get-balance CONTRACT))   
   )
)