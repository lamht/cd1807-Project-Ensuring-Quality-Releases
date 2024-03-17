resource "azurerm_network_interface" "" {
  name                = "vm_network1"
  location            = "eastus"
  resource_group_name = "Azuredevops"

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "vm_subnet_1"
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = ""
  }
}

resource "azurerm_linux_virtual_machine" "" {
  name                = "lamht_vm1"
  location            = "eastus"
  resource_group_name = "Azuredevops"
  size                = "Standard_DS2_v2"
  admin_username      = "devopsagent"
  network_interface_ids = []
  admin_ssh_key {
    username   = "evopsagent"
    public_key = "file("~/.ssh/id_rsa.pub")"
  }
  os_disk {
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
