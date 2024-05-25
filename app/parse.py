import os

# date must be valid newsletter date as MM-DD-YY
def parse_newsletter(date):
    date_components = date.split('-')
    with open(f'newsletter_archive/{date_components[2]}/{date_components[0]}/{date}.html', 'r') as f:
        html = f.read()
        
        body_start = html.find('body')
        html = '<div ' + html[(body_start + 4):]

        body_end = html.find('</body>')
        html = html[:body_end] + '</div>'
        
    return html

def get_all_newsletter_file_names():
    file_names = []
    
    sorted_yrs = os.listdir("newsletter_archive")
    sorted_yrs.sort()

    for d in sorted_yrs:
        dpath = os.path.join("newsletter_archive", d)
        if os.path.isdir(dpath):
            sorted_mos = os.listdir(dpath)
            sorted_mos.sort()
            for subd in sorted_mos:
                subpath = os.path.join("newsletter_archive", d, subd)
                if os.path.isdir(subpath):
                    sorted_dys = os.listdir(subpath)
                    sorted_dys.sort()
                    for f in sorted_dys:
                        splt = os.path.splitext(f)
                        if splt[1] == ".html": file_names.append(splt[0])
    return file_names
