# Student management system built with React, tailwind and firebase

# Challenges: 

Authentication & Security: Managing Firebase Auth and Firestore rules was tricky at first. I learned how to securely link each user’s data using an ownerId field and configure domain-based access for GitHub Pages.

Real-Time Data Syncing: Implementing live Firestore updates required careful handling of snapshot listeners and cleanup functions to avoid re-rendering issues.

Deployment Issues: The app worked locally but initially failed online due to unauthorized domains and router mismatches. Switching to HashRouter and updating Firebase settings fixed this.

Data Ownership Migration: I created a custom script to backfill missing ownership fields in existing student records, aligning the database with the new access model.
