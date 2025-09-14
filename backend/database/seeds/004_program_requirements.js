exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('program_requirements').del();
  
  // Inserts seed entries
  await knex('program_requirements').insert([
    // Computer Science Program Requirements
    {
      id: 1,
      program_id: 1,
      requirement_type: 'academic',
      title: 'Bachelor Degree',
      description: 'Bachelor degree in Computer Science, Software Engineering, or related field',
      is_required: true,
      sort_order: 1
    },
    {
      id: 2,
      program_id: 1,
      requirement_type: 'language',
      title: 'English Proficiency',
      description: 'IELTS 6.5 or TOEFL 90 or equivalent',
      is_required: true,
      sort_order: 2
    },
    {
      id: 3,
      program_id: 1,
      requirement_type: 'academic',
      title: 'GPA Requirement',
      description: 'Minimum GPA of 3.0 on a 4.0 scale',
      is_required: true,
      sort_order: 3
    },
    {
      id: 4,
      program_id: 1,
      requirement_type: 'document',
      title: 'Academic Transcripts',
      description: 'Official transcripts from all previous institutions',
      is_required: true,
      sort_order: 4
    },
    {
      id: 5,
      program_id: 1,
      requirement_type: 'document',
      title: 'Statement of Purpose',
      description: 'Personal statement explaining your academic and career goals',
      is_required: true,
      sort_order: 5
    },
    {
      id: 6,
      program_id: 1,
      requirement_type: 'document',
      title: 'Letters of Recommendation',
      description: 'Two academic recommendation letters',
      is_required: true,
      sort_order: 6
    },

    // International Business Program Requirements
    {
      id: 7,
      program_id: 2,
      requirement_type: 'academic',
      title: 'High School Diploma',
      description: 'High school diploma or equivalent',
      is_required: true,
      sort_order: 1
    },
    {
      id: 8,
      program_id: 2,
      requirement_type: 'language',
      title: 'English Proficiency',
      description: 'IELTS 6.0 or TOEFL 80 or equivalent',
      is_required: true,
      sort_order: 2
    },
    {
      id: 9,
      program_id: 2,
      requirement_type: 'academic',
      title: 'GPA Requirement',
      description: 'Minimum GPA of 2.8 on a 4.0 scale',
      is_required: true,
      sort_order: 3
    },
    {
      id: 10,
      program_id: 2,
      requirement_type: 'document',
      title: 'High School Transcripts',
      description: 'Official high school transcripts',
      is_required: true,
      sort_order: 4
    },

    // Chinese Language Program Requirements
    {
      id: 11,
      program_id: 3,
      requirement_type: 'academic',
      title: 'High School Diploma',
      description: 'High school diploma or equivalent',
      is_required: true,
      sort_order: 1
    },
    {
      id: 12,
      program_id: 3,
      requirement_type: 'document',
      title: 'Passport Copy',
      description: 'Valid passport copy',
      is_required: true,
      sort_order: 2
    },
    {
      id: 13,
      program_id: 3,
      requirement_type: 'document',
      title: 'Health Certificate',
      description: 'Medical examination certificate',
      is_required: true,
      sort_order: 3
    },

    // Engineering PhD Program Requirements
    {
      id: 14,
      program_id: 4,
      requirement_type: 'academic',
      title: 'Master Degree',
      description: 'Master degree in Engineering or related field',
      is_required: true,
      sort_order: 1
    },
    {
      id: 15,
      program_id: 4,
      requirement_type: 'language',
      title: 'English Proficiency',
      description: 'IELTS 7.0 or TOEFL 100 or equivalent',
      is_required: true,
      sort_order: 2
    },
    {
      id: 16,
      program_id: 4,
      requirement_type: 'academic',
      title: 'GPA Requirement',
      description: 'Minimum GPA of 3.2 on a 4.0 scale',
      is_required: true,
      sort_order: 3
    },
    {
      id: 17,
      program_id: 4,
      requirement_type: 'document',
      title: 'Research Proposal',
      description: 'Detailed research proposal (2000-3000 words)',
      is_required: true,
      sort_order: 4
    },
    {
      id: 18,
      program_id: 4,
      requirement_type: 'document',
      title: 'Academic Publications',
      description: 'List of academic publications (if any)',
      is_required: false,
      sort_order: 5
    },

    // Medicine Program Requirements
    {
      id: 19,
      program_id: 5,
      requirement_type: 'academic',
      title: 'Bachelor Degree',
      description: 'Bachelor degree in Medicine or related field',
      is_required: true,
      sort_order: 1
    },
    {
      id: 20,
      program_id: 5,
      requirement_type: 'language',
      title: 'Chinese Proficiency',
      description: 'HSK Level 4 or above',
      is_required: true,
      sort_order: 2
    },
    {
      id: 21,
      program_id: 5,
      requirement_type: 'academic',
      title: 'GPA Requirement',
      description: 'Minimum GPA of 3.0 on a 4.0 scale',
      is_required: true,
      sort_order: 3
    },
    {
      id: 22,
      program_id: 5,
      requirement_type: 'document',
      title: 'Medical License',
      description: 'Valid medical license (if applicable)',
      is_required: false,
      sort_order: 4
    },

    // ISSP Program Requirements
    {
      id: 23,
      program_id: 6,
      requirement_type: 'academic',
      title: 'High School Diploma',
      description: 'High school diploma with excellent academic record',
      is_required: true,
      sort_order: 1
    },
    {
      id: 24,
      program_id: 6,
      requirement_type: 'language',
      title: 'English Proficiency',
      description: 'IELTS 6.5 or TOEFL 90 or equivalent',
      is_required: true,
      sort_order: 2
    },
    {
      id: 25,
      program_id: 6,
      requirement_type: 'academic',
      title: 'GPA Requirement',
      description: 'Minimum GPA of 3.5 on a 4.0 scale',
      is_required: true,
      sort_order: 3
    },
    {
      id: 26,
      program_id: 6,
      requirement_type: 'other',
      title: 'Leadership Experience',
      description: 'Demonstrated leadership experience in school or community',
      is_required: false,
      sort_order: 4
    },
    {
      id: 27,
      program_id: 6,
      requirement_type: 'document',
      title: 'Personal Statement',
      description: 'Personal statement highlighting achievements and goals',
      is_required: true,
      sort_order: 5
    }
  ]);
};
