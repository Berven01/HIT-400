def get_month(date):

    month_num = date[5: 7]
    month_num = int(month_num)
    
    if month_num == 1:
        return 'Jan'
    elif month_num == 2:
        return 'Feb'
    elif month_num == 3:
        return 'Mar'
    elif month_num == 4:
        return 'Apr'
    elif month_num == 5:
        return 'May'
    elif month_num == 6:
        return 'Jun'
    elif month_num == 7:
        return 'Jul'
    elif month_num == 8:
        return 'Aug'
    elif month_num == 9:
        return 'Sept'
    elif month_num == 10:
        return 'Oct'
    elif month_num == 11:
        return 'Nov'
    elif month_num == 12:
        return 'Dec'