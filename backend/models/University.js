const db = require('../database/connection');

class University {
  static async create(universityData) {
    const [university] = await db('universities')
      .insert(universityData)
      .returning('*');
    return university;
  }

  static async findById(id) {
    const university = await db('universities')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'universities.*',
        'cities.name as city_name',
        'cities.province as city_province'
      )
      .where('universities.id', id)
      .first();
    
    if (university) {
      // Get university images
      const images = await db('university_images')
        .where('university_id', id)
        .orderBy('sort_order', 'asc');
      
      university.images = images;
    }
    
    return university;
  }

  static async getAll(filters = {}, limit = 20, offset = 0, includeInactive = false) {
    let query = db('universities')
      .leftJoin('cities', 'universities.city_id', 'cities.id')
      .select(
        'universities.*',
        'cities.name as city_name',
        'cities.province as city_province'
      );

    // Only filter by is_active for public routes
    if (!includeInactive) {
      query = query.where('universities.is_active', true);
    }

    // Apply filters
    if (filters.city_id) {
      query = query.where('universities.city_id', filters.city_id);
    }
    
    if (filters.is_featured) {
      query = query.where('universities.is_featured', true);
    }
    
    if (filters.search) {
      query = query.where(function() {
        this.where('universities.name', 'ilike', `%${filters.search}%`)
            .orWhere('universities.english_name', 'ilike', `%${filters.search}%`);
      });
    }

    const universities = await query
      .limit(limit)
      .offset(offset)
      .orderBy('universities.is_featured', 'desc')
      .orderBy('universities.name', 'asc');

    let totalQuery = db('universities');
    if (!includeInactive) {
      totalQuery = totalQuery.where('is_active', true);
    }
    const total = await totalQuery.count('* as count').first();

    return {
      universities,
      total: parseInt(total.count),
      limit,
      offset
    };
  }

  static async update(id, updates) {
    const [university] = await db('universities')
      .where({ id })
      .update(updates)
      .returning('*');
    return university;
  }

  static async delete(id) {
    return await db('universities').where({ id }).del();
  }

  static async addImage(universityId, imageData) {
    const [image] = await db('university_images')
      .insert({ university_id: universityId, ...imageData })
      .returning('*');
    return image;
  }

  static async updateImage(imageId, updates) {
    const [image] = await db('university_images')
      .where({ id: imageId })
      .update(updates)
      .returning('*');
    return image;
  }

  static async deleteImage(imageId) {
    return await db('university_images').where({ id: imageId }).del();
  }

  static async getImages(universityId) {
    return await db('university_images')
      .where('university_id', universityId)
      .orderBy('sort_order', 'asc');
  }
}

module.exports = University;
