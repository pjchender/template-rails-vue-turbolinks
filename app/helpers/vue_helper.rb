module VueHelper
  def vue_outlet(html_options = {})
    html_options = html_options.reverse_merge(data: {})
    html_options[:data].tap do |data|
      data[:vue_component_outlet] = "_v" + SecureRandom.hex(5)
    end
    html_tag = html_options[:tag] || :div
    html_options.except!(:tag)
    content_tag(html_tag, '', html_options) do
      yield
    end
  end
end