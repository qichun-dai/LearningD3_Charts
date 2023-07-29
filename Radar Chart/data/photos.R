library(tidyverse)

# Step 1: List all directories starting with "2019"
root_directory <- "D:/Photo/"  # Replace with your folder path
all_dirs <- list.dirs(path = root_directory, full.names = TRUE, recursive = FALSE)

# Filter directories starting with "2019"
dirs_2019 <- all_dirs[grep("^2019", basename(all_dirs))]

print(dirs_2019)

# Step 2: For each directory, get the photo information
photo_data <- lapply(dirs_2019, function(dir_path) {
  photo_files <- list.files(path = dir_path, pattern = "\\.(jpg|jpeg|png|bmp|tiff)$", full.names = TRUE, ignore.case = TRUE)
  if(length(photo_files) > 0) {
    file_info <- file.info(photo_files)
    return(data.frame(
      FileName = rownames(file_info),
      CreatedTime = file_info$ctime,
      LastModified = file_info$mtime,
      AccessTime = file_info$atime
    ))
  } else {
    return(data.frame( FileName = character(), CreatedTime = as.POSIXct(character()), LastModified = as.POSIXct(character()), AccessTime = as.POSIXct(character())))
  }
})

# Combine all data frames into one
photo_data_combined <- bind_rows(photo_data)

photo_2019 <- photo_data_combined %>% 
  filter(startsWith(format(LastModified, "%Y-%m-%d %H:%M:%S"), "2019")) %>% 
  mutate(date = format(LastModified, "%Y-%m-%d"))

# Create a sequence of dates from the start to the end of 2019
dates_2019 <- seq(from = as.Date("2019-01-01"), 
                  to = as.Date("2019-12-31"), 
                  by = "day") 

# Convert the vector of dates to a dataframe
df_2019 <- data.frame(dates = dates_2019) %>% 
  mutate(date = format(dates, "%Y-%m-%d"))

df_2019 <- df_2019%>% 
  left_join(photo_2019, by = c("date"="date")) %>% 
  group_by(date) %>% 
  summarize(numbers = n())

if (requireNamespace("rstudioapi", quietly = TRUE)) {
  script_path <- rstudioapi::getSourceEditorContext()$path
  print(script_path)
  dir_only <- sub("/[^/]+$", "", script_path)
  setwd(dir_only)
}

write.csv(photo_data_combined, file = "./photos_all.csv", row.names = FALSE)

write.csv(photo_2019, file = "./photos_2019.csv", row.names = FALSE)

write.csv(df_2019, file = "./df_2019.csv", row.names = FALSE)


