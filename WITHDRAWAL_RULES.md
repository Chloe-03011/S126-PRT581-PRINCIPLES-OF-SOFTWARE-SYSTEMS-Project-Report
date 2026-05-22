# Withdrawal and Reward Fulfillment Rules

This document outlines the foundational logic for financial transactions and creator accountability on the Nitun Sir Crowdfunding platform.

## 1. Platform Fee Logic
- **Standard Fee:** A 10% platform fee is deducted from the total amount raised by every successful campaign.
- **Performance Incentive:** If a creator achieves a 90%+ "Backer Confirmation Rate" for rewards, the fee for their *next* project is reduced to 5%.
- **Calculation:** `Available for Withdrawal = (Total Raised * 0.90) - Already Withdrawn`.

## 2. Withdrawal Milestones (70/30 Split)
To ensure backers receive their rewards, funds are released in two stages:
- **Stage 1 (Operational Funds):** 70% of the net funds are available immediately after the campaign ends successfully. This is intended to cover manufacturing and shipping costs.
- **Stage 2 (Final Payout):** The remaining 30% is unlocked only after 80% of backers have clicked the "Confirm Receipt" button in their dashboard.

## 3. Backer Confirmation Flow
- Once a creator marks a reward as **"Delivered"** (Physical) or **"Sent"** (Email), the backer sees a **"Confirm Receipt"** button in their "Backed Projects" tab.
- Clicking this updates the status to **"Confirmed by Backer"**.
- This confirmation is the primary metric for creator trustworthiness.

## 4. Admin Monitoring & Intervention
- **Fulfillment Dashboard:** Admins have a global view of all rewards: `Earned` vs. `Delivered` vs. `Confirmed`.
- **Fraud Detection:** If a creator marks rewards as "Delivered" but confirmation rates remain near 0% for 30+ days, the Admin panel flags the account for "Potential Fulfillment Fraud."
- **Withdrawal Freezing:** Admins can manually freeze the Stage 2 (30%) payout if a dispute is raised or if the creator is non-responsive.

## 5. Implementation Status
- [x] Documented Rules
- [ ] Backend Fee Calculation Logic
- [ ] Backer "Confirm Receipt" Button
- [ ] Admin Fulfillment Monitor
- [ ] 70/30 Split Logic in Withdrawal Route
