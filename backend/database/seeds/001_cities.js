exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('cities').del();
  
  // Inserts seed entries
  await knex('cities').insert([
    {
      id: 1,
      name: 'Beijing',
      province: 'Beijing',
      description: 'Capital city of China, home to many prestigious universities',
      is_active: true
    },
    {
      id: 2,
      name: 'Shanghai',
      province: 'Shanghai',
      description: 'China\'s largest city and financial center',
      is_active: true
    },
    {
      id: 3,
      name: 'Guangzhou',
      province: 'Guangdong',
      description: 'Major city in southern China',
      is_active: true
    },
    {
      id: 4,
      name: 'Shenzhen',
      province: 'Guangdong',
      description: 'Modern city known for technology and innovation',
      is_active: true
    },
    {
      id: 5,
      name: 'Hangzhou',
      province: 'Zhejiang',
      description: 'Beautiful city known for West Lake and technology',
      is_active: true
    },
    {
      id: 6,
      name: 'Nanjing',
      province: 'Jiangsu',
      description: 'Historic city with rich cultural heritage',
      is_active: true
    },
    {
      id: 7,
      name: 'Hefei',
      province: 'Anhui',
      description: 'Capital of Anhui province',
      is_active: true
    },
    {
      id: 8,
      name: 'Chengdu',
      province: 'Sichuan',
      description: 'Capital of Sichuan province, known for pandas',
      is_active: true
    }
  ]);
};
