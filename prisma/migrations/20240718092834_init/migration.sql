-- CreateTable
CREATE TABLE `tbl_word_game` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `word` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `tbl_word_game_word_key`(`word`),
    UNIQUE INDEX `tbl_word_game_image_key`(`image`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
