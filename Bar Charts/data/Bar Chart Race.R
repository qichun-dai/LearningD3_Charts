library(tidyverse)
library(dplyr)
library(readxl)

trips <- read_excel("./trips.xlsx",sheet = "For Bar Chart Race") %>% 
  mutate(Date = parse_date(Date, format = "%d-%m-%y"),
         YearMonth = format(Date,"%Y%m")) 

# this freq is not the format we need 
# because if the station is not listed in that month, it's not in the ranking
freq <- trips %>% 
  group_by(YearMonth,Station) %>% 
  summarize(frequency = n()) %>% 
  arrange(YearMonth,desc(frequency)) %>% 
  group_by(Station) %>% 
  mutate(running_freq = cumsum(frequency)) %>% 
  group_by(YearMonth) %>% 
  mutate(rank = rank(-running_freq,ties.method = "first")) %>% 
  arrange(YearMonth,rank)


date_uniq <- as_tibble(unique(trips$YearMonth)) %>% 
  rename(YearMonth=value)

station_uniq <- as_tibble(unique(trips$Station)) %>% 
  rename(Station=value)

combination <- date_uniq %>% 
  full_join(station_uniq, by = character()) 

bar_race <-  trips %>% 
  group_by(YearMonth,Station) %>% 
  summarize(frequency = n()) %>% 
  right_join(combination,by = c("YearMonth", "Station")) %>% 
  mutate(frequency = ifelse(is.na(frequency),0,frequency)) %>% 
  arrange(YearMonth,desc(frequency)) %>% 
  group_by(Station) %>% 
  mutate(running_freq = cumsum(frequency)) %>% 
  group_by(YearMonth) %>% 
  mutate(rank = rank(-running_freq,ties.method = "first")) %>% 
  arrange(YearMonth,rank)