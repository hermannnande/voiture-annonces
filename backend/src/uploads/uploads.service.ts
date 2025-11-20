import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import ImageKit from 'imagekit';

@Injectable()
export class UploadsService {
  private imagekit: ImageKit;
  private useImageKit: boolean;

  constructor(private configService: ConfigService) {
    // Vérifier si ImageKit est configuré
    const publicKey = this.configService.get('IMAGEKIT_PUBLIC_KEY');
    const privateKey = this.configService.get('IMAGEKIT_PRIVATE_KEY');
    const urlEndpoint = this.configService.get('IMAGEKIT_URL_ENDPOINT');

    // Debug: Afficher l'état des variables (sans montrer les valeurs complètes)
    console.log('🔍 Configuration ImageKit:');
    console.log(`  - Public Key: ${publicKey ? `✅ (${publicKey.substring(0, 15)}...)` : '❌ NON DÉFINIE'}`);
    console.log(`  - Private Key: ${privateKey ? `✅ (${privateKey.substring(0, 15)}...)` : '❌ NON DÉFINIE'}`);
    console.log(`  - URL Endpoint: ${urlEndpoint ? `✅ ${urlEndpoint}` : '❌ NON DÉFINIE'}`);

    this.useImageKit = !!(publicKey && privateKey && urlEndpoint);

    if (this.useImageKit) {
      try {
        this.imagekit = new ImageKit({
          publicKey,
          privateKey,
          urlEndpoint,
        });
        console.log('✅ ImageKit configuré - Stockage cloud activé');
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation d\'ImageKit:', error.message);
        this.useImageKit = false;
      }
    } else {
      console.warn('⚠️ ImageKit non configuré - Les variables d\'environnement sont manquantes');
      console.warn('   Ajoute ces variables dans Railway:');
      console.warn('   - IMAGEKIT_PUBLIC_KEY');
      console.warn('   - IMAGEKIT_PRIVATE_KEY');
      console.warn('   - IMAGEKIT_URL_ENDPOINT');
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

    try {
      // Optimiser l'image avec sharp
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1200, 900, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 85 })
        .toBuffer();

      if (this.useImageKit) {
        // Upload vers ImageKit (stockage permanent)
        const filename = `listings/${uuidv4()}.webp`;
        
        const uploadResponse = await this.imagekit.upload({
          file: optimizedBuffer,
          fileName: filename,
          folder: '/voiture-annonces/listings',
          useUniqueFileName: true,
        });

        console.log('✅ Image uploadée vers ImageKit:', uploadResponse.url);
        return uploadResponse.url;
      } else {
        // Fallback: stockage local (éphémère)
        console.warn('⚠️ Utilisation du stockage local - fichiers seront perdus au redémarrage');
        const filename = `${uuidv4()}.webp`;
        return `/uploads/listings/${filename}`;
      }
    } catch (error) {
      console.error('Erreur lors du traitement de l\'image:', error);
      throw new BadRequestException('Erreur lors du traitement de l\'image');
    }
  }

  async deleteFile(filepath: string): Promise<void> {
    if (this.useImageKit && filepath.includes('imagekit.io')) {
      // Extraire le fileId de l'URL ImageKit
      try {
        const fileId = this.extractImageKitFileId(filepath);
        if (fileId) {
          await this.imagekit.deleteFile(fileId);
          console.log('✅ Image supprimée d\'ImageKit');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image ImageKit:', error);
      }
    }
    // Pour le stockage local, on ne fait rien car les fichiers sont éphémères
  }

  private extractImageKitFileId(url: string): string | null {
    // L'URL ImageKit contient le fileId dans le path
    // Exemple: https://ik.imagekit.io/lk2o6kxne/voiture-annonces/listings/uuid.webp
    const match = url.match(/\/([^\/]+)\.(webp|jpg|jpeg|png)$/);
    return match ? match[1] : null;
  }
}





