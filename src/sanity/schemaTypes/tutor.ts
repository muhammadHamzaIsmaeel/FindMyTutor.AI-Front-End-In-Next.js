import type { Rule } from 'sanity';

export default {
  name: 'tutor',
  title: 'Tutor',
  type: 'document',
  fields: [
    { name: 'userId', title: 'User ID', type: 'string' },
    { name: 'name', title: 'Full Name', type: 'string', validation: (Rule: Rule) => Rule.required() },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    },
    { name: 'gender', title: 'Gender', type: 'string', options: { list: ['male', 'female'] } },
    { name: 'subject', title: 'Subject or Skill', type: 'string' },
    { name: 'mode', title: 'Mode of Teaching', type: 'string', options: { list: ['online', 'home', 'institute'] } },
    { name: 'experience', title: 'Experience (years)', type: 'number' },

    // Education block
    {
      name: 'education',
      title: 'Education',
      type: 'object',
      fields: [
        { name: 'highestDegree', title: 'Highest Degree', type: 'string' },
        { name: 'field', title: 'Field of Study', type: 'string' },
        { name: 'institute', title: 'Institute/University', type: 'string' },
        { name: 'graduationYear', title: 'Graduation Year', type: 'number' },
      ],
    },

    // Address block
    {
      name: 'address',
      title: 'Address',
      type: 'object',
      fields: [
        { name: 'city', title: 'City', type: 'string' },
        { name: 'area', title: 'Area/Locality', type: 'string' },
        { name: 'addressLine', title: 'Full Address', type: 'string' },
        { name: 'postalCode', title: 'Postal Code', type: 'string' },
      ],
    },

    { name: 'location', title: 'Location (legacy)', type: 'string' }, // optional compatibility
    { name: 'photo', title: 'Profile Image', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Short Bio', type: 'text' },
    { name: 'contact', title: 'Phone or WhatsApp', type: 'string' },

    // ✅ New field
    { 
      name: 'verified', 
      title: 'Verified', 
      type: 'boolean', 
      initialValue: false, 
      description: 'Mark tutor as verified' 
    },
  ],
};