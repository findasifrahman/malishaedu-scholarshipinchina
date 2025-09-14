const db = require('../database/connection');

class City {
  static async create(cityData) {
    const [city] = await db('cities')
      .insert(cityData)
      .returning('*');
    return city;
  }

  static async findById(id) {
    return await db('cities').where({ id }).first();
  }

  static async getAll(limit = 50, offset = 0) {
    const cities = await db('cities')
      .where('is_active', true)
      .limit(limit)
      .offset(offset)
      .orderBy('name', 'asc');

    const total = await db('cities')
      .where('is_active', true)
      .count('* as count')
      .first();

    return {
      cities,
      total: parseInt(total.count),
      limit,
      offset
    };
  }

  static async update(id, updates) {
    const [city] = await db('cities')
      .where({ id })
      .update(updates)
      .returning('*');
    return city;
  }

  static async delete(id) {
    return await db('cities').where({ id }).del();
  }

  static async getByProvince(province) {
    return await db('cities')
      .where('province', province)
      .where('is_active', true)
      .orderBy('name', 'asc');
  }

  static async getProvinces() {
    return await db('cities')
      .distinct('province')
      .where('is_active', true)
      .orderBy('province', 'asc');
  }
}

module.exports = City;
