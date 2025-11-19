import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadsService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR') || './uploads';
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'listings'), { recursive: true });
    } catch (error) {
      console.error('Erreur lors de la création du dossier uploads:', error);
    }
  }

  async uploadListingImage(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni');
    }

    // Vérifier le type de fichier
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException('Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WebP');
    }

    // Générer un nom unique
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(this.uploadDir, 'listings', filename);

    try {
      // Optimiser et compresser l'image avec sharp
      await sharp(file.buffer)
        .resize(1200, 900, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      // Créer aussi une version thumbnail
      const thumbnailFilename = `thumb_${filename}`;
      const thumbnailPath = path.join(this.uploadDir, 'listings', thumbnailFilename);

      await sharp(file.buffer)
        .resize(400, 300, {
          fit: 'cover',
        })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      // Retourner l'URL relative
      return `/uploads/listings/${filename}`;
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      throw new BadRequestException('Erreur lors du traitement de l\'image');
    }
  }

  async deleteFile(filepath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, filepath.replace('/uploads/', ''));
      await fs.unlink(fullPath);

      // Supprimer aussi le thumbnail si existe
      const thumbnailPath = fullPath.replace(/([^/]+)$/, 'thumb_$1');
      try {
        await fs.unlink(thumbnailPath);
      } catch (error) {
        // Ignorer si le thumbnail n'existe pas
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
    }
  }
}





