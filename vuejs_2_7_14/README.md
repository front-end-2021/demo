[github.io.vue2.7.14](https://front-end-2021.github.io/demo/vuejs_2_7_14/)

# Logic
Search function will result in Overview and Customers tabs
1. Overview
    - Search
    - Click arrow/name to collapse/expand Goal (Left side)
    - Tick/untick set done Action (Left side)
    - Click name/Start of action go to start date in view right side
    - Click End of action go to end date in view right side
    - Drag/drop action in left side
    - Drag/drop action timeline in right side
2. Inventory
    - View item name
    - View Start - End Date
        + If Start, End in 1 year show in format: Tue, 18 Jul - Thu, 5 Oct 2023
        + If Start, End in other years, show with format: Thu, 3 Nov 2022 – Tue, 3 Jan 2023
3. Customers
    - Drag drop item in side "View Tasks"
    - Click [+] to expand menu Edit, Delete
    - Click [ - ] to collapse menu
    - Click Edit to show form
    - Click Delete to remove item immediately
     + Remove Goal will remove list child action
    - Edit item will update in Overview and Inventory Tab

### version (1.0.1)