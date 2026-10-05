INSERT INTO tutors (id, name, fee, rating, reviews, verified, location, img, bio, availability, experience) VALUES 
(1, 'Rafiq Ahmed', 9000, 4.9, 42, 1, 'Dhanmondi, Dhaka', 'https://i.pravatar.cc/150?img=12', 'Physics and Math tutor', 'Weekdays, Evening', '5 years')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO tutors (id, name, fee, rating, reviews, verified, location, img, bio, availability, experience) VALUES 
(2, 'Farhana Islam', 7000, 4.7, 28, 1, 'Bashundhara, Dhaka', 'https://i.pravatar.cc/150?img=32', 'Language tutor', 'Weekends', '3 years'),
(3, 'Shakil Hasan', 10000, 4.8, 65, 1, 'Uttara, Dhaka', 'https://i.pravatar.cc/150?img=51', 'HSC Chemistry and Biology specialist', 'Weekdays', '6 years')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO categories (id, name, description, iconName, color, image, activeJobs, avgSalary, status) VALUES 
(1, 'Science & Math', 'Physics, Chemistry, Higher Math, Biology, General Science', 'Atom', '#2563eb', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=150&h=150&fit=crop', 28, '৳5,000 - ৳10,000/mo', 'active'),
(2, 'Languages & Literature', 'English Grammar, Spoken English, Bangla, French, IELTS Prep', 'Globe', '#7c3aed', 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=150&h=150&fit=crop', 19, '৳5,000 - ৳10,000/mo', 'active')
ON DUPLICATE KEY UPDATE name=VALUES(name);
