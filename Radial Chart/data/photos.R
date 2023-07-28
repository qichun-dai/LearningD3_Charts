library(tidyverse)
path_to_directory <- setwd("D:/Photo/2019-01/")


photo_files <- list.files(path = "path_to_directory", pattern = "\\.(jpg|jpeg|png|bmp|tiff)$", full.names = TRUE, recursive = FALSE, ignore.case = TRUE)

print(photo_files)

print(file.info(path_to_directory))
