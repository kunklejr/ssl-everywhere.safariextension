require 'rake'
require 'rexml/document'
require 'json'
require 'plist'

task :default => :build

desc "Delete all generated resources"
task :clean do
  File.delete(*Dir.glob("rules/*.js"))
  File.delete("Settings.plist")
end

desc "Transform HTTP Everywhere rules to SSL Everywhere rules"
task :transform_rules do
  settings = []
  Dir.glob("rules/*.xml") do |filename|
    xml = File.read(filename)
    ruleset = parse_rules_xml(xml)
    settings.push({ :name => ruleset[:name], :enabled => ruleset[:enabled] })
    js = convert_to_js(ruleset)
    js_filename = filename.gsub(/\.xml$/, ".js")
    puts "Transforming #{filename} into #{js_filename}"
    File.open(js_filename, 'w') { |f| f.write(js) }
  end
  
  plist = generate_settings_plist(settings)
  puts "Writing Settings.plist"
  File.open("Settings.plist", 'w') { |f| f.write(plist.to_plist) }
end

desc "Generate extension global file"
task :generate_global_file => :transform_rules do
  js_file_names = Dir.glob("src/*.js") | Dir.glob("rules/*.js")
  global_file_content = generate_global_file(js_file_names)
  global_file_name = "global.html"
  puts "Writing global file to #{global_file_name}"
  File.open(global_file_name, 'w') { |f| f.write(global_file_content) }
end

desc "Build everything necessary for the extension"
task :build => [:clean, :transform_rules, :generate_global_file]

def parse_rules_xml(xml)
  rs = {}
  doc = REXML::Document.new(xml)
  ruleset = doc.root
  rs[:name] = ruleset.attributes['name']
  rs[:enabled] = ruleset.attributes['default_off'] == nil
  rs[:match_rule] = ruleset.attributes['match_rule']
  
  rs[:targets] = []
  ruleset.elements.each('target') do |target|
    rs[:targets].push(target.attributes['host'])
  end
  
  rs[:exclusions] = []
  ruleset.elements.each('exclusion') do |exclusion|
    rs[:exclusions].push(exclusion.attributes['pattern'])
  end
  
  rs[:secure_cookies] = []
  ruleset.elements.each('securecookie') do |securecookie|
    rs[:secure_cookies].push({:host => securecookie.attributes['host'], :name => securecookie.attributes['name']})
  end
  
  rs[:rules] = []
  ruleset.elements.each('rule') do |rule|
    rs[:rules].push({:from => rule.attributes['from'], :to => rule.attributes['to']})
  end
  
  rs
end

def convert_to_js(ruleset)
  <<-JS
(function() {
  var config = #{JSON.pretty_generate(ruleset)};
  
  var ruleset = new RuleSet(config);
  register(ruleset);
})()
  JS
end

def generate_global_file(js_filenames)
  scripts = js_filenames.collect { |filename| "<script src='#{filename}'></script>" }
  <<-HTML
<!DOCTYPE HTML>
#{scripts}
  HTML
end

def generate_settings_plist(rules)
  plist = [{ 'Title' => 'Rules', 'Type' => 'Group' }]
  rules.each do |rule|
    plist << {  'DefaultValue' => rule[:enabled], 
                'Key' => "rule.#{rule[:name]}", 
                'Title' => rule[:name], 
                'Type' => 'CheckBox' }
  end
  plist
end