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