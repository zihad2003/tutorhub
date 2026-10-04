ALTER TABLE requests
ADD CONSTRAINT fk_requests_parent
FOREIGN KEY (parent_id) REFERENCES parents(id) ON DELETE SET NULL;

ALTER TABLE lessons
ADD CONSTRAINT fk_lessons_hired_tutor
FOREIGN KEY (hired_tutor_id) REFERENCES hired_tutors(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_lessons_tutor
FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE SET NULL;
